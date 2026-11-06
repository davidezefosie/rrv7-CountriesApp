import { useState } from "react";
import type { Route } from "../+types/root";
import { Link } from "react-router";

export async function clientLoader() {
  const response = await fetch(
    "https://pw-d20261017a29.plainwork-apps.workers.dev/v3.1/all?fields=name,flags,capital,region,population",
  );

  const data = await response.json();
  return data;
}

export default function Countries({ loaderData }: Route.ComponentProps) {
  const countries = loaderData ?? [];
  const [search, setSearch] = useState<string>("");
  const [region, setRegion] = useState<string>("");

  const filteredCountries = countries.filter((country: any) => {
    const matchesRegion =
      !region || country.region.toLowerCase() === region.toLowerCase();
    const matchesSearch =
      !search ||
      country.name.common.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Countries</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/2 focus:outline-none focus:border-indigo-500"
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/2 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Regions</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>
      </div>

      {filteredCountries.length === 0 ? (
        <div>No countries match your filters.</div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCountries.map((country: any, key: number) => (
            <Link to={`/countries/${country.name.common}`}>
              <li
                key={key}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition"
              >
                {country.name.common}

                <div>
                  Region: {country.region} | Population: {country.population}
                </div>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}
