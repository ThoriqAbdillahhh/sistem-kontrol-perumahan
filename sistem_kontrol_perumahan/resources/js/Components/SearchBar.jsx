import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Cari..." }) {
    return (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2">
            <Search size={14} className="text-muted-foreground" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-40 bg-transparent text-xs outline-none"
            />
        </div>
    );
}