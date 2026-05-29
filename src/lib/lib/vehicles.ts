import vehiclesData from '../data/vehicles.json';
import { vehiclesJsonSchema, type Vehicle } from '../schemas/vehicle';

// Validate at module load time — throws if JSON is invalid
const { vehicles } = vehiclesJsonSchema.parse(vehiclesData);

export function getAllVehicles(): Vehicle[] {
  return vehicles;
}

export function getSearchableVehicles() {
  return vehicles.map(v => ({
    id: v.id,
    brand: v.brand,
    model: v.model,
    year: v.year,
    category: v.category,
    slug: v.slug,
    image: v.image,
    pricePerDay: v.pricePerDay
  }));
}

export function getFeaturedVehicles(limit = 3): Vehicle[] {
  return vehicles.filter((v) => v.featured).slice(0, limit);
}

export interface VehicleFilters {
  category?: string;
  brand?: string;
  maxPricePerDay?: number;
  search?: string;
}

export function filterVehicles(
  vehicleList: Vehicle[],
  filters: VehicleFilters
): Vehicle[] {
  return vehicleList.filter((v) => {
    if (filters.category !== undefined) {
      if (v.category !== filters.category) return false;
    }

    if (filters.brand !== undefined) {
      if (v.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
    }

    if (filters.maxPricePerDay !== undefined) {
      if (v.pricePerDay > filters.maxPricePerDay) return false;
    }

    if (filters.search !== undefined && filters.search.trim() !== '') {
      const needle = filters.search.toLowerCase();
      const haystack = `${v.brand} ${v.model}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }

    return true;
  });
}

export function getUniqueBrands(vehicleList: { brand: string }[]): string[] {
  return [...new Set(vehicleList.map((v) => v.brand))].sort();
}

export function getUniqueCategories(vehicleList: { category: string }[]): string[] {
  return [...new Set(vehicleList.map((v) => v.category))].sort();
}
