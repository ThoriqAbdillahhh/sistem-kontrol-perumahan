# Graph Report - sistem_kontrol_perumahan  (2026-07-16)

## Corpus Check
- 149 files · ~32,334 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 640 nodes · 852 edges · 96 communities (88 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c8b6cd84`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 28
- Community 29
- Community 30
- Community 31
- Community 49

## God Nodes (most connected - your core abstractions)
1. `User` - 44 edges
2. `Controller` - 31 edges
3. `TestCase` - 20 edges
4. `Material` - 19 edges
5. `Unit` - 19 edges
6. `LogKeluarHarian` - 18 edges
7. `MatrixProgress` - 18 edges
8. `LogMasukGudang` - 13 edges
9. `LogGudangController` - 11 edges
10. `StokGudangService` - 10 edges

## Surprising Connections (you probably didn't know these)
- `AuthenticatedSessionController` --inherits--> `Controller`  [EXTRACTED]
  app/Http/Controllers/Auth/AuthenticatedSessionController.php → app/Http/Controllers/Controller.php
- `DashboardController` --inherits--> `Controller`  [EXTRACTED]
  app/Http/Controllers/DashboardController.php → app/Http/Controllers/Controller.php
- `LogGudangController` --inherits--> `Controller`  [EXTRACTED]
  app/Http/Controllers/LogGudangController.php → app/Http/Controllers/Controller.php
- `MaterialController` --inherits--> `Controller`  [EXTRACTED]
  app/Http/Controllers/MaterialController.php → app/Http/Controllers/Controller.php
- `ProfileController` --inherits--> `Controller`  [EXTRACTED]
  app/Http/Controllers/ProfileController.php → app/Http/Controllers/Controller.php

## Import Cycles
- None detected.

## Communities (96 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (18): Request, UserRoleController, User, Authenticatable, BaseTestCase, HasRoles, Notifiable, RefreshDatabase (+10 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (34): ConfirmablePasswordController, RedirectResponse, Request, Response, EmailVerificationNotificationController, RedirectResponse, Request, EmailVerificationPromptController (+26 more)

### Community 2 - "Community 2"
Cohesion: 0.04
Nodes (46): pestphp/pest-plugin, php-http/discovery, autoload, autoload-dev, psr-4, psr-4, config, allow-plugins (+38 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (29): AppServiceProvider, autoprefixer, concurrently, @headlessui/react, @inertiajs/react, laravel-vite-plugin, devDependencies, autoprefixer (+21 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (6): StandarProgressController, StoreMatrixDetailRequest, StoreMatrixProgressRequest, MatrixProgress, MatrixProgressDetail, HasFactory

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (6): MaterialController, Response, StoreMaterialRequest, UpdateMaterialRequest, Material, FormRequest

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (26): scripts, dev, post-autoload-dump, post-create-project-cmd, post-root-package-install, post-update-cmd, pre-package-uninstall, setup (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (7): DatabaseSeeder, MaterialSeeder, RolePermissionSeeder, RoleSeeder, UnitSeeder, UserSeeder, Seeder

### Community 8 - "Community 8"
Cohesion: 0.21
Nodes (5): AuthenticatedSessionController, RedirectResponse, Request, Response, LoginRequest

### Community 9 - "Community 9"
Cohesion: 0.23
Nodes (3): DashboardController, LogKeluarHarian, StokGudangService

### Community 10 - "Community 10"
Cohesion: 0.14
Nodes (13): @heroicons/react, lucide-react, dependencies, @heroicons/react, lucide-react, tailwindcss, private, $schema (+5 more)

### Community 11 - "Community 11"
Cohesion: 0.25
Nodes (7): About Laravel, Agentic Development, Code of Conduct, Contributing, Learning Laravel, License, Security Vulnerabilities

### Community 12 - "Community 12"
Cohesion: 0.23
Nodes (5): RedirectResponse, Request, Response, ProfileController, ProfileUpdateRequest

### Community 13 - "Community 13"
Cohesion: 0.24
Nodes (3): Validator, StoreProgressUnitRequest, ProgressUnit

### Community 14 - "Community 14"
Cohesion: 0.24
Nodes (3): LogGudangHistory, LogMasukGudang, Model

### Community 15 - "Community 15"
Cohesion: 0.15
Nodes (4): LogGudangController, Validator, StoreLogKeluarRequest, StoreLogMasukRequest

### Community 16 - "Community 16"
Cohesion: 0.21
Nodes (3): UnitController, StoreUnitRequest, Unit

### Community 17 - "Community 17"
Cohesion: 0.22
Nodes (8): compilerOptions, baseUrl, paths, exclude, ziggy-js, node_modules, public, ./vendor/tightenco/ziggy

### Community 18 - "Community 18"
Cohesion: 0.36
Nodes (3): DeleteUserForm(), UpdatePasswordForm(), UpdateProfileInformation()

### Community 20 - "Community 20"
Cohesion: 0.43
Nodes (3): HandleInertiaRequests, Request, Middleware

### Community 21 - "Community 21"
Cohesion: 0.38
Nodes (5): formatRupiah(), highlightMatch(), MaterialIndex(), PAGE_SIZE_OPTIONS, TABLE_COLUMNS

### Community 23 - "Community 23"
Cohesion: 0.53
Nodes (4): clampProgress(), Dashboard(), formatRupiahJt(), progressBarColor()

### Community 24 - "Community 24"
Cohesion: 0.40
Nodes (4): getOverallStatus(), ProgressIndex(), STATUS_COLOR, STATUS_PRIORITY

### Community 25 - "Community 25"
Cohesion: 0.32
Nodes (3): UserFactory, Factory, static

## Knowledge Gaps
- **89 isolated node(s):** `$schema`, `name`, `type`, `description`, `laravel` (+84 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `Community 0` to `Community 1`, `Community 4`, `Community 7`, `Community 8`, `Community 25`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `Controller` connect `Community 1` to `Community 0`, `Community 4`, `Community 5`, `Community 8`, `Community 9`, `Community 12`, `Community 15`, `Community 16`, `Community 19`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `Material` connect `Community 5` to `Community 4`, `Community 7`, `Community 9`, `Community 14`, `Community 15`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `$schema`, `name`, `type` to the rest of the system?**
  _89 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06345848757271286 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06168831168831169 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._