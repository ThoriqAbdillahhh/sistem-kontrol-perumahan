# Graph Report - sistem_kontrol_perumahan  (2026-07-17)

## Corpus Check
- 157 files · ~36,152 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 677 nodes · 954 edges · 91 communities (85 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ae6ec062`
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
- Community 11
- Community 16
- Community 17
- Community 18
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
1. `User` - 50 edges
2. `Controller` - 31 edges
3. `Material` - 27 edges
4. `Unit` - 25 edges
5. `TestCase` - 24 edges
6. `MatrixProgress` - 22 edges
7. `LogKeluarHarian` - 21 edges
8. `LogMasukGudang` - 18 edges
9. `StokGudangService` - 14 edges
10. `LogGudangController` - 11 edges

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

## Communities (91 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (19): Request, UserRoleController, User, Authenticatable, BaseTestCase, HasRoles, Notifiable, RefreshDatabase (+11 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (34): ConfirmablePasswordController, RedirectResponse, Request, Response, EmailVerificationNotificationController, RedirectResponse, Request, EmailVerificationPromptController (+26 more)

### Community 2 - "Community 2"
Cohesion: 0.04
Nodes (46): pestphp/pest-plugin, php-http/discovery, autoload, autoload-dev, psr-4, psr-4, config, allow-plugins (+38 more)

### Community 3 - "Community 3"
Cohesion: 0.04
Nodes (42): AppServiceProvider, autoprefixer, concurrently, @headlessui/react, @heroicons/react, @inertiajs/react, laravel-vite-plugin, lucide-react (+34 more)

### Community 4 - "Community 4"
Cohesion: 0.10
Nodes (6): StandarProgressController, StoreMatrixDetailRequest, StoreMatrixProgressRequest, MatrixProgress, MatrixProgressDetail, HasFactory

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (12): MaterialController, Response, RedirectResponse, Request, Response, ProfileController, ProfileUpdateRequest, Validator (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (26): scripts, dev, post-autoload-dump, post-create-project-cmd, post-root-package-install, post-update-cmd, pre-package-uninstall, setup (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (12): Material, BalancedLogGudangSeeder, DatabaseSeeder, LogGudangSeeder, MaterialSeeder, MatrixProgressSeeder, RolePermissionSeeder, RoleSeeder (+4 more)

### Community 8 - "Community 8"
Cohesion: 0.21
Nodes (5): AuthenticatedSessionController, RedirectResponse, Request, Response, LoginRequest

### Community 9 - "Community 9"
Cohesion: 0.06
Nodes (17): DashboardController, LogGudangController, ProgressController, StoreLogMasukRequest, Validator, StoreProgressUnitRequest, Validator, UpdateLogKeluarRequest (+9 more)

### Community 11 - "Community 11"
Cohesion: 0.25
Nodes (7): About Laravel, Agentic Development, Code of Conduct, Contributing, Learning Laravel, License, Security Vulnerabilities

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (4): Request, UnitController, StoreUnitRequest, Unit

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
Cohesion: 0.33
Nodes (4): getOverallStatus(), ProgressIndex(), STATUS_COLOR, STATUS_PRIORITY

### Community 25 - "Community 25"
Cohesion: 0.32
Nodes (3): UserFactory, Factory, static

### Community 31 - "Community 31"
Cohesion: 0.60
Nodes (3): highlightText(), normalizeUnitCode(), UnitIndex()

## Knowledge Gaps
- **89 isolated node(s):** `$schema`, `name`, `type`, `description`, `laravel` (+84 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `Community 0` to `Community 1`, `Community 4`, `Community 7`, `Community 8`, `Community 9`, `Community 25`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `Controller` connect `Community 1` to `Community 0`, `Community 4`, `Community 5`, `Community 8`, `Community 9`, `Community 16`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `Material` connect `Community 7` to `Community 16`, `Community 9`, `Community 4`, `Community 5`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `Unit` (e.g. with `.index()` and `.history()`) actually correct?**
  _`Unit` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `name`, `type` to the rest of the system?**
  _89 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05961538461538462 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06168831168831169 - nodes in this community are weakly interconnected._