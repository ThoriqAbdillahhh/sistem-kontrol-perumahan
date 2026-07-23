<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserMenuOverride;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserRoleController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with(['roles', 'menuOverrides'])->orderBy('name')->get()->map(fn ($u) => [
            'id'            => $u->id,
            'nama'          => $u->name,
            'username'      => $u->username,
            'email'         => $u->email,
            'role'          => $u->roles->pluck('name')->first() ?? '-',
            'isActive'      => (bool) $u->is_active,
            'lastLogin'     => $u->last_login_at?->format('d M Y \\· H:i') ?? '—',
            'menuOverrides' => $u->menuOverrides->map(fn ($o) => [
                'menu_key' => $o->menu_key,
                'visible'  => $o->visible,
            ])->values()->toArray(),
        ]);

        return Inertia::render('UserRole/Index', [
            'users'      => $users,
            'roles'      => Role::pluck('name'),
            'authUserId' => $request->user()->id,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'      => ['required', 'string', 'max:255'],
            'username'  => ['required', 'string', 'max:255', 'unique:users,username'],
            'email'     => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'  => ['required', 'string', 'min:8'],
            'role'      => ['required', 'string', 'exists:roles,name'],
            'is_active' => ['boolean'],
        ]);

        $user = User::create([
            'name'      => $data['name'],
            'username'  => $data['username'],
            'email'     => $data['email'],
            'password'  => Hash::make($data['password']),
            'is_active' => $data['is_active'] ?? true,
        ]);

        $user->assignRole($data['role']);

        return back();
    }

    public function update(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return back()->withErrors([
                'general' => 'Anda tidak dapat mengedit akun Anda sendiri.'
            ]);
        }

        $data = $request->validate([
            'name'      => ['required', 'string', 'max:255'],
            'username'  => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'username')->ignore($user->id)
            ],
            'email'     => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id)
            ],
            'password'  => ['nullable', 'string', 'min:8'],
            'role'      => ['nullable', 'string', 'exists:roles,name'],
            'is_active' => ['boolean'],
        ]);

        $user->update([
            'name'      => $data['name'],
            'username'  => $data['username'],
            'email'     => $data['email'],
            'is_active' => $data['is_active'] ?? $user->is_active,
            ...(!empty($data['password'])
                ? ['password' => Hash::make($data['password'])]
                : []),
        ]);

        if (!empty($data['role'])) {
            $user->syncRoles($data['role']);
        }

        return back();
    }

    public function toggleStatus(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return back()->withErrors(['general' => 'Anda tidak dapat mengubah status akun Anda sendiri.']);
        }

        $user->update(['is_active' => ! $user->is_active]);
        return back();
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return back()->withErrors(['general' => 'Anda tidak dapat menghapus akun Anda sendiri.']);
        }

        $user->delete();
        return back();
    }

    /**
     * Simpan override visibilitas menu untuk user tertentu.
     * Payload: { overrides: [{ menu_key: string, visible: bool }] }
     */
    public function updateMenuOverride(Request $request, User $user)
    {
        $data = $request->validate([
            'overrides'            => ['required', 'array'],
            'overrides.*.menu_key' => ['required', 'string', 'max:100'],
            'overrides.*.visible'  => ['required', 'boolean'],
        ]);

        // Hapus semua override lama, ganti dengan yang baru
        $user->menuOverrides()->delete();

        foreach ($data['overrides'] as $override) {
            // Hanya simpan yang benar-benar menjadi override (bukan "default")
            UserMenuOverride::create([
                'user_id'  => $user->id,
                'menu_key' => $override['menu_key'],
                'visible'  => $override['visible'],
            ]);
        }

        return back();
    }
}