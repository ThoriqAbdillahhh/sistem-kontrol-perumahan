<?php

namespace Tests\Feature;

use App\Models\AkunReferensi;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AkunReferensiTest extends TestCase
{
    use RefreshDatabase;

    public function test_deleted_account_is_removed_from_the_visible_list(): void
    {
        $role = Role::create(['name' => 'Admin Keuangan']);
        $user = User::factory()->create();
        $user->assignRole($role);

        $akun = AkunReferensi::create([
            'kode_akun' => '6103',
            'nama_akun' => 'Listrik Proyek',
            'kategori' => 'HPP',
            'jenis' => 'keluar',
            'created_by' => $user->id,
        ]);

        $this->actingAs($user)
            ->delete(route('finance.akun-referensi.destroy', ['akunReferensi' => $akun->id]))
            ->assertRedirect();

        $response = $this->actingAs($user)
            ->get(route('finance.akun-referensi'));

       $response->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('AkunReferensi/Index')
                ->where('akunList', fn ($akunList) => collect($akunList)->doesntContain(fn ($item) => $item['id'] === $akun->id))
            );
    }
}
