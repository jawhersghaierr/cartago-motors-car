"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";
import { createCarSchema, type CreateCarSchema } from "@/validators/car";
import {
  CAR_BRANDS,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  type Car,
} from "@/types/car";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/components/admin/ImageUpload";

const SELECT_CLASS =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

interface CarFormProps {
  car?: Car;
}

export default function CarForm({ car }: CarFormProps) {
  const router = useRouter();
  const [decodingVin, setDecodingVin] = useState(false);
  const [vinExtra, setVinExtra] = useState<{ label: string; value: string }[]>([]);
  const isEditing = !!car;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateCarSchema>({
    resolver: zodResolver(createCarSchema),
    defaultValues: car
      ? {
          brand: car.brand,
          model: car.model,
          year: car.year,
          vin: car.vin ?? "",
          plate_number: car.plate_number ?? "",
          fuel: car.fuel,
          engine: car.engine ?? "",
          transmission: car.transmission,
          horsepower: car.horsepower ?? undefined,
          color: car.color ?? "",
          price: car.price ?? undefined,
          status: car.status,
          images: car.images,
          description: car.description ?? "",
        }
      : {
          brand: "",
          model: "",
          year: new Date().getFullYear(),
          vin: "",
          plate_number: "",
          fuel: "Essence",
          engine: "",
          transmission: "Manuelle",
          status: "available",
          images: [],
          description: "",
        },
  });

  const images = watch("images") ?? [];
  const vinValue = watch("vin");

  async function decodeVin() {
    const vin = (vinValue ?? "").trim().toUpperCase();
    if (vin.length !== 17) {
      toast.warning("Le VIN doit contenir exactement 17 caractères");
      return;
    }
    setDecodingVin(true);
    try {
      const res = await fetch(`/api/vin?vin=${vin}`);
      if (!res.ok) {
        toast.error("Impossible de décoder ce VIN");
        return;
      }
      const data = await res.json();
      let filled = 0;

      if (data.brand) {
        setValue("brand", data.brand, { shouldValidate: true });
        filled++;
      }
      if (data.model) {
        setValue("model", data.model, { shouldValidate: true });
        filled++;
      }
      if (data.year) {
        setValue("year", data.year, { shouldValidate: true });
        filled++;
      }
      if (data.fuel) {
        setValue("fuel", data.fuel, { shouldValidate: true });
        filled++;
      }
      if (data.engine) {
        setValue("engine", data.engine, { shouldValidate: true });
        filled++;
      }
      if (data.transmission) {
        setValue("transmission", data.transmission, { shouldValidate: true });
        filled++;
      }
      if (data.horsepower) {
        setValue("horsepower", data.horsepower, { shouldValidate: true });
        filled++;
      }
      if (data.color) {
        setValue("color", data.color, { shouldValidate: true });
        filled++;
      }

      // Champs déjà mappés — exclus des détails supplémentaires
      const MAPPED_LABELS = [
        'make', 'model', 'model year', 'fuel type - primary', 'fuel type',
        'engine (full)', 'engine model', 'displacement (l)', 'engine',
        'transmission style', 'transmission',
        'engine power (hp)', 'maximum net power (hp)', 'power (hp)',
        'engine power (kw)', 'maximum net power (kw)',
        'exterior color', 'color',
      ]
      if (Array.isArray(data.raw)) {
        const extras = data.raw
          .filter((item: { label: string; value: unknown }) =>
            item.value !== null &&
            item.value !== undefined &&
            String(item.value).trim() !== '' &&
            !MAPPED_LABELS.includes(item.label.toLowerCase())
          )
          .map((item: { label: string; value: unknown }) => ({
            label: item.label,
            value: String(item.value),
          }))
        setVinExtra(extras);
      }

      if (filled > 0) {
        toast.success(
          `${filled} champ${filled > 1 ? "s" : ""} pré-rempli${filled > 1 ? "s" : ""} via VIN`,
        );
      } else {
        toast.info("Aucune donnée trouvée pour ce VIN");
      }
    } catch {
      toast.error("Erreur lors du décodage VIN");
    } finally {
      setDecodingVin(false);
    }
  }

  async function onSubmit(data: CreateCarSchema) {
    try {
      const url = isEditing ? `/api/cars/${car!.id}` : "/api/cars";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Erreur lors de la sauvegarde");
        return;
      }

      toast.success(
        isEditing
          ? "Voiture modifiée avec succès"
          : "Voiture ajoutée avec succès",
      );
      router.push("/admin/cars");
      router.refresh();
    } catch {
      toast.error("Erreur réseau, veuillez réessayer");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-10">
      {/* ── VIN & Plaque ── */}
      <section className="bg-white rounded-xl border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-slate-800">
            Numéros d'identification
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="vin">VIN</Label>
            <div className="flex gap-2">
              <Input
                id="vin"
                {...register("vin")}
                placeholder="17 caractères"
                maxLength={17}
                className="font-mono tracking-widest uppercase"
                onInput={(e) => {
                  const t = e.currentTarget;
                  t.value = t.value.toUpperCase();
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5"
                disabled={
                  decodingVin || !vinValue || vinValue.trim().length !== 17
                }
                onClick={decodeVin}
              >
                {decodingVin ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Wand2 size={14} />
                )}
                Décoder
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Décodage automatique via API
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plate_number">Immatriculation</Label>
            <Input
              id="plate_number"
              {...register("plate_number")}
              placeholder="ex : AB-123-CD"
              className="uppercase"
            />
          </div>
        </div>
      </section>

      {/* ── Identification ── */}
      <section className="bg-white rounded-xl border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-slate-800">Identification</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="brand">Marque *</Label>
            <select id="brand" {...register("brand")} className={SELECT_CLASS}>
              <option value="">Sélectionner une marque</option>
              {CAR_BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            {errors.brand && (
              <p className="text-xs text-destructive">{errors.brand.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="model">Modèle *</Label>
            <Input
              id="model"
              {...register("model")}
              placeholder="ex : Série 3 320d"
            />
            {errors.model && (
              <p className="text-xs text-destructive">{errors.model.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="year">Année *</Label>
            <Input
              id="year"
              type="number"
              {...register("year", { valueAsNumber: true })}
              min={1900}
              max={new Date().getFullYear() + 1}
              placeholder={String(new Date().getFullYear())}
            />
            {errors.year && (
              <p className="text-xs text-destructive">{errors.year.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status">Statut</Label>
            <select
              id="status"
              {...register("status")}
              className={SELECT_CLASS}
            >
              <option value="available">Disponible</option>
              <option value="reserved">Réservé</option>
              <option value="sold">Vendu</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Caractéristiques techniques ── */}
      <section className="bg-white rounded-xl border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-slate-800">
            Caractéristiques techniques
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="fuel">Carburant *</Label>
            <select id="fuel" {...register("fuel")} className={SELECT_CLASS}>
              {FUEL_TYPES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="transmission">Transmission *</Label>
            <select
              id="transmission"
              {...register("transmission")}
              className={SELECT_CLASS}
            >
              {TRANSMISSION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="engine">Moteur</Label>
            <Input
              id="engine"
              {...register("engine")}
              placeholder="ex : 2.0 TDI 150 ch"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="horsepower">Puissance (ch)</Label>
            <Input
              id="horsepower"
              type="number"
              {...register("horsepower")}
              placeholder="ex : 150"
              min={1}
            />
            {errors.horsepower && (
              <p className="text-xs text-destructive">
                {errors.horsepower.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="color">Couleur</Label>
            <Input
              id="color"
              {...register("color")}
              placeholder="ex : Noir métallisé"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="price">Prix (€)</Label>
            <Input
              id="price"
              type="number"
              {...register("price")}
              placeholder="ex : 25000"
              min={0}
              step={100}
            />
            {errors.price && (
              <p className="text-xs text-destructive">{errors.price.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Photos ── */}
      <section className="bg-white rounded-xl border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-slate-800">Photos</h2>
        </div>
        <div className="p-6">
          <ImageUpload
            images={images}
            onChange={(urls) => setValue("images", urls)}
          />
        </div>
      </section>

      {/* ── Description ── */}
      <section className="bg-white rounded-xl border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-slate-800">Description</h2>
        </div>
        <div className="p-6">
          <Textarea
            {...register("description")}
            placeholder="Décrivez le véhicule, son état, ses options…"
            rows={4}
          />
        </div>
      </section>

      <Separator />

      {/* ── Actions ── */}
      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 size={15} className="animate-spin mr-2" />}
          {isEditing ? "Enregistrer les modifications" : "Ajouter la voiture"}
        </Button>
      </div>
    </form>
  );
}
