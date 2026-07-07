<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. View v_stock_status
        DB::statement("
            CREATE OR REPLACE VIEW v_stock_status AS
            SELECT 
                m.code AS material_code,
                m.name AS material_name,
                m.unit AS material_unit,
                m.category AS material_category,
                COALESCE(r.total_in, 0) AS total_in,
                COALESCE(i.total_out, 0) AS total_out,
                (COALESCE(r.total_in, 0) - COALESCE(i.total_out, 0)) AS current_stock,
                COALESCE(r.value_in, 0) AS value_in,
                COALESCE(i.value_out, 0) AS value_out,
                (COALESCE(r.value_in, 0) - COALESCE(i.value_out, 0)) AS current_value
            FROM materials m
            LEFT JOIN (
                SELECT material_code, SUM(qty) AS total_in, SUM(total_price) AS value_in
                FROM material_receipts
                GROUP BY material_code
            ) r ON m.code = r.material_code
            LEFT JOIN (
                SELECT material_code, SUM(qty) AS total_out, SUM(total_price) AS value_out
                FROM material_issuances
                GROUP BY material_code
            ) i ON m.code = i.material_code
        ");

        // 2. View v_unit_material_progress (Long format)
        DB::statement("
            CREATE OR REPLACE VIEW v_unit_material_progress AS
            WITH unit_stages AS (
                SELECT 
                    u.code AS unit_code,
                    (
                        SELECT ps.id 
                        FROM progress_stages ps 
                        WHERE ps.max_progress <= u.progress_percent 
                        ORDER BY ps.max_progress DESC 
                        LIMIT 1
                    ) AS stage_id
                FROM units u
            )
            SELECT 
                u.code AS unit_code,
                u.zone AS unit_zone,
                u.status AS unit_status,
                u.progress_percent,
                u.last_update,
                m.code AS material_code,
                m.name AS material_name,
                m.unit AS material_unit,
                COALESCE(sm.std_qty, 0) AS std_qty,
                COALESCE(iss.total_issued, 0) AS actual_qty,
                CASE 
                    WHEN COALESCE(iss.total_issued, 0) > COALESCE(sm.std_qty, 0) THEN '🔴 OVER'
                    ELSE '🟢 AMAN'
                END AS analysis_status
            FROM units u
            CROSS JOIN materials m
            LEFT JOIN unit_stages us ON u.code = us.unit_code
            LEFT JOIN stage_materials sm ON us.stage_id = sm.stage_id AND m.code = sm.material_code
            LEFT JOIN (
                SELECT unit_code, material_code, SUM(qty) AS total_issued
                FROM material_issuances
                GROUP BY unit_code, material_code
            ) iss ON u.code = iss.unit_code AND m.code = iss.material_code
        ");

        // 3. View v_monitoring_progress (Wide format)
        DB::statement("
            CREATE OR REPLACE VIEW v_monitoring_progress AS
            SELECT 
                u.code AS unit,
                u.zone,
                u.progress_percent AS progress_terakhir,
                u.last_update,
                u.status,
                -- Semen (MT001)
                COALESCE(MAX(CASE WHEN m.code = 'MT001' THEN pm.std_qty END), 0) AS semen_std,
                COALESCE(MAX(CASE WHEN m.code = 'MT001' THEN pm.actual_qty END), 0) AS semen_aktual,
                MAX(CASE WHEN m.code = 'MT001' THEN pm.analysis_status END) AS semen_analisa,
                -- Pasir Pasang (MT002)
                COALESCE(MAX(CASE WHEN m.code = 'MT002' THEN pm.std_qty END), 0) AS pasir_std,
                COALESCE(MAX(CASE WHEN m.code = 'MT002' THEN pm.actual_qty END), 0) AS pasir_aktual,
                MAX(CASE WHEN m.code = 'MT002' THEN pm.analysis_status END) AS pasir_analisa,
                -- Split (MT005)
                COALESCE(MAX(CASE WHEN m.code = 'MT005' THEN pm.std_qty END), 0) AS split_std,
                COALESCE(MAX(CASE WHEN m.code = 'MT005' THEN pm.actual_qty END), 0) AS split_aktual,
                MAX(CASE WHEN m.code = 'MT005' THEN pm.analysis_status END) AS split_analisa,
                -- Besi 6 (MT006)
                COALESCE(MAX(CASE WHEN m.code = 'MT006' THEN pm.std_qty END), 0) AS besi6_std,
                COALESCE(MAX(CASE WHEN m.code = 'MT006' THEN pm.actual_qty END), 0) AS besi6_aktual,
                MAX(CASE WHEN m.code = 'MT006' THEN pm.analysis_status END) AS besi6_analisa,
                -- Besi 8 (MT007)
                COALESCE(MAX(CASE WHEN m.code = 'MT007' THEN pm.std_qty END), 0) AS besi8_std,
                COALESCE(MAX(CASE WHEN m.code = 'MT007' THEN pm.actual_qty END), 0) AS besi8_aktual,
                MAX(CASE WHEN m.code = 'MT007' THEN pm.analysis_status END) AS besi8_analisa,
                -- Bata Bolong (MT004)
                COALESCE(MAX(CASE WHEN m.code = 'MT004' THEN pm.std_qty END), 0) AS bata_std,
                COALESCE(MAX(CASE WHEN m.code = 'MT004' THEN pm.actual_qty END), 0) AS bata_aktual,
                MAX(CASE WHEN m.code = 'MT004' THEN pm.analysis_status END) AS bata_analisa,
                -- Batu Belah (MT055)
                COALESCE(MAX(CASE WHEN m.code = 'MT055' THEN pm.std_qty END), 0) AS batu_kali_std,
                COALESCE(MAX(CASE WHEN m.code = 'MT055' THEN pm.actual_qty END), 0) AS batu_kali_aktual,
                MAX(CASE WHEN m.code = 'MT055' THEN pm.analysis_status END) AS batu_kali_analisa,
                -- Status Global
                CASE 
                    WHEN '🔴 OVER' IN (
                        MAX(CASE WHEN m.code = 'MT001' THEN pm.analysis_status END),
                        MAX(CASE WHEN m.code = 'MT002' THEN pm.analysis_status END),
                        MAX(CASE WHEN m.code = 'MT005' THEN pm.analysis_status END),
                        MAX(CASE WHEN m.code = 'MT006' THEN pm.analysis_status END),
                        MAX(CASE WHEN m.code = 'MT007' THEN pm.analysis_status END),
                        MAX(CASE WHEN m.code = 'MT004' THEN pm.analysis_status END),
                        MAX(CASE WHEN m.code = 'MT055' THEN pm.analysis_status END)
                    ) THEN '🔴 BOROS'
                    ELSE '🟢 AMAN'
                END AS status_global
            FROM units u
            CROSS JOIN materials m
            LEFT JOIN v_unit_material_progress pm ON u.code = pm.unit_code AND m.code = pm.material_code
            GROUP BY u.code, u.zone, u.progress_percent, u.last_update, u.status
        ");

        // 4. View v_hpp_unit
        DB::statement("
            CREATE OR REPLACE VIEW v_hpp_unit AS
            SELECT 
                u.code AS unit,
                u.zone,
                COALESCE(m.total_material, 0) AS material,
                COALESCE(w.total_labor, 0) AS upah,
                COALESCE(o.total_operational, 0) AS operasional,
                (COALESCE(m.total_material, 0) + COALESCE(w.total_labor, 0) + COALESCE(o.total_operational, 0)) AS total_hpp
            FROM units u
            LEFT JOIN (
                SELECT unit_code, SUM(total_price) AS total_material
                FROM material_issuances
                GROUP BY unit_code
            ) m ON u.code = m.unit_code
            LEFT JOIN (
                SELECT cd.unit_code, SUM(cd.amount) AS total_labor
                FROM cash_disbursements cd
                JOIN accounts a ON cd.account_code = a.code
                WHERE a.category = 'HPP' AND a.code IN ('2002', '2003') -- Upah Tukang / Borongan
                GROUP BY cd.unit_code
            ) w ON u.code = w.unit_code
            LEFT JOIN (
                SELECT cd.unit_code, SUM(cd.amount) AS total_operational
                FROM cash_disbursements cd
                JOIN accounts a ON cd.account_code = a.code
                WHERE a.category = 'OPEX'
                GROUP BY cd.unit_code
            ) o ON u.code = o.unit_code
        ");

        // 5. View v_spj_otomatis
        DB::statement("
            CREATE OR REPLACE VIEW v_spj_otomatis AS
            WITH transaction_union AS (
                -- 1. Kas Masuk (Debit)
                SELECT 
                    date,
                    'Kas Masuk'::VARCHAR(50) AS transaction_type,
                    phase AS account_name,
                    description,
                    NULL::DECIMAL(12,2) AS qty,
                    NULL::VARCHAR(50) AS unit,
                    amount AS debit,
                    0.00::DECIMAL(15,2) AS credit,
                    recipient,
                    source AS sender_or_supplier
                FROM cash_receipts

                UNION ALL

                -- 2. Kas Keluar (Kredit)
                SELECT 
                    cd.date,
                    'Kas Keluar'::VARCHAR(50) AS transaction_type,
                    a.name AS account_name,
                    cd.description,
                    cd.qty,
                    cd.unit,
                    0.00::DECIMAL(15,2) AS debit,
                    cd.amount AS credit,
                    cd.recipient,
                    NULL::VARCHAR(255) AS sender_or_supplier
                FROM cash_disbursements cd
                JOIN accounts a ON cd.account_code = a.code

                UNION ALL

                -- 3. Material Masuk (Kredit)
                SELECT 
                    mr.date,
                    'Material Masuk'::VARCHAR(50) AS transaction_type,
                    'Persediaan Material'::VARCHAR(255) AS account_name,
                    m.name AS description,
                    mr.qty,
                    m.unit,
                    0.00::DECIMAL(15,2) AS debit,
                    mr.total_price AS credit,
                    NULL::VARCHAR(255) AS recipient,
                    mr.supplier AS sender_or_supplier
                FROM material_receipts mr
                JOIN materials m ON mr.material_code = m.code
            )
            SELECT 
                date,
                transaction_type,
                account_name,
                description,
                qty,
                unit,
                debit,
                credit,
                recipient,
                sender_or_supplier,
                -- Running balance
                SUM(debit - credit) OVER (ORDER BY date, transaction_type, description, debit, qty) AS saldo,
                -- Minggu ke- dari 2026-04-07
                CASE 
                    WHEN date IS NULL THEN NULL 
                    ELSE FLOOR((date - '2026-04-07'::DATE) / 7) + 1 
                END AS week_no
            FROM transaction_union
            ORDER BY date
        ");

        // 6. View v_dashboard_summary
        DB::statement("
            CREATE OR REPLACE VIEW v_dashboard_summary AS
            SELECT 
                (SELECT COUNT(*) FROM units WHERE code <> 'Infrastruktur') AS total_units,
                (SELECT COUNT(*) FROM units WHERE status = 'Aktif' AND code <> 'Infrastruktur') AS active_units,
                (SELECT COUNT(*) FROM units WHERE progress_percent = 100 AND code <> 'Infrastruktur') AS completed_units,
                COALESCE((SELECT SUM(amount) FROM cash_receipts), 0) AS total_capital_in,
                COALESCE((SELECT SUM(amount) FROM cash_disbursements), 0) AS total_cash_expenses,
                COALESCE((SELECT SUM(total_price) FROM material_receipts), 0) AS total_material_in_value,
                COALESCE((SELECT SUM(amount) FROM cash_disbursements), 0) + COALESCE((SELECT SUM(total_price) FROM material_receipts), 0) AS total_cash_outflow,
                COALESCE((SELECT SUM(amount) FROM cash_receipts), 0) - (COALESCE((SELECT SUM(amount) FROM cash_disbursements), 0) + COALESCE((SELECT SUM(total_price) FROM material_receipts), 0)) AS remaining_cash
        ");
    }

    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS v_dashboard_summary");
        DB::statement("DROP VIEW IF EXISTS v_spj_otomatis");
        DB::statement("DROP VIEW IF EXISTS v_hpp_unit");
        DB::statement("DROP VIEW IF EXISTS v_monitoring_progress");
        DB::statement("DROP VIEW IF EXISTS v_unit_material_progress");
        DB::statement("DROP VIEW IF EXISTS v_stock_status");
    }
};
