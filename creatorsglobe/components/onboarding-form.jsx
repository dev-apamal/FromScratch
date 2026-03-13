"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  AVAILABILITY_STATUS_OPTIONS,
  CREATOR_ROLE_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  creatorOnboardingSchema,
} from "@/lib/onboarding";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const clientOnboardingSchema = creatorOnboardingSchema.extend({
  portfolioFiles: z
    .custom((value) => Array.isArray(value) && value.length > 0, {
      message: "Upload at least one portfolio image.",
    })
    .refine(
      (files) =>
        Array.isArray(files) &&
        files.every((file) => file instanceof File && file.type.startsWith("image/")),
      {
        message: "Portfolio uploads must be image files.",
      }
    )
    .refine(
      (files) =>
        Array.isArray(files) && files.every((file) => file.size <= MAX_FILE_SIZE),
      {
        message: "Each portfolio image must be 5MB or smaller.",
      }
    )
    .refine((files) => Array.isArray(files) && files.length <= 8, {
      message: "Upload up to eight portfolio images.",
    }),
});

const defaultLocation = {
  latitude: 40.7128,
  longitude: -74.006,
  zoom: 9,
};

function FieldError({ message }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-red-600">{message}</p>;
}

export default function OnboardingForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(clientOnboardingSchema),
    defaultValues: {
      headline: "",
      bio: "",
      city: "",
      latitude: defaultLocation.latitude,
      longitude: defaultLocation.longitude,
      roles: [],
      experienceLevel: "INTERMEDIATE",
      availabilityStatus: "AVAILABLE",
      budgetMin: 500,
      budgetMax: 2500,
      portfolioFiles: [],
    },
  });

  const [latitude, longitude, portfolioFiles] = useWatch({
    control,
    name: ["latitude", "longitude", "portfolioFiles"],
  });
  const previews = useMemo(
    () =>
      Array.isArray(portfolioFiles)
        ? portfolioFiles.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file),
          }))
        : [],
    [portfolioFiles]
  );

  useEffect(
    () => () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    },
    [previews]
  );

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");

    const formData = new FormData();
    formData.set("headline", values.headline || "");
    formData.set("bio", values.bio);
    formData.set("city", values.city);
    formData.set("latitude", String(values.latitude));
    formData.set("longitude", String(values.longitude));
    formData.set("experienceLevel", values.experienceLevel);
    formData.set("availabilityStatus", values.availabilityStatus);
    formData.set("budgetMin", String(values.budgetMin));
    formData.set("budgetMax", String(values.budgetMax));
    formData.set("roles", JSON.stringify(values.roles));

    values.portfolioFiles.forEach((file) => {
      formData.append("portfolioFiles", file);
    });

    const response = await fetch("/api/onboarding", {
      method: "POST",
      body: formData,
    });

    const payload = await response.json();

    if (!response.ok) {
      setServerError(payload.error || "Unable to save your profile.");
      return;
    }

    startTransition(() => {
      router.push("/dashboard");
      router.refresh();
    });
  });

  return (
    <form className="space-y-10" onSubmit={onSubmit}>
      <section className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-zinc-900" htmlFor="headline">
            Headline
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-900"
            id="headline"
            placeholder="Documentary cinematographer with a love for natural light"
            {...register("headline")}
          />
          <FieldError message={errors.headline?.message} />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-zinc-900" htmlFor="bio">
            Bio
          </label>
          <textarea
            className="mt-2 min-h-40 w-full rounded-3xl border border-zinc-200 bg-white px-4 py-4 text-zinc-900 outline-none transition focus:border-zinc-900"
            id="bio"
            placeholder="Tell producers what you make, how long you've been doing it, and the kind of projects you love."
            {...register("bio")}
          />
          <FieldError message={errors.bio?.message} />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-900" htmlFor="city">
            City
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-900"
            id="city"
            placeholder="Mumbai"
            {...register("city")}
          />
          <FieldError message={errors.city?.message} />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-900" htmlFor="experienceLevel">
            Experience level
          </label>
          <select
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-900"
            id="experienceLevel"
            {...register("experienceLevel")}
          >
            {EXPERIENCE_LEVEL_OPTIONS.map((level) => (
              <option key={level} value={level}>
                {level.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <FieldError message={errors.experienceLevel?.message} />
        </div>
      </section>

      <section>
        <span className="text-sm font-medium text-zinc-900">Roles</span>
        <Controller
          control={control}
          name="roles"
          render={({ field }) => (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CREATOR_ROLE_OPTIONS.map((role) => {
                const active = field.value.includes(role);

                return (
                  <button
                    key={role}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                      active
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400"
                    }`}
                    onClick={() => {
                      const nextValue = active
                        ? field.value.filter((item) => item !== role)
                        : [...field.value, role];
                      field.onChange(nextValue);
                    }}
                    type="button"
                  >
                    {role.replaceAll("_", " ")}
                  </button>
                );
              })}
            </div>
          )}
        />
        <FieldError message={errors.roles?.message} />
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-zinc-900" htmlFor="availabilityStatus">
            Availability
          </label>
          <select
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-900"
            id="availabilityStatus"
            {...register("availabilityStatus")}
          >
            {AVAILABILITY_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <FieldError message={errors.availabilityStatus?.message} />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-900" htmlFor="budgetMin">
            Minimum budget
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-900"
            id="budgetMin"
            min="0"
            step="1"
            type="number"
            {...register("budgetMin")}
          />
          <FieldError message={errors.budgetMin?.message} />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-900" htmlFor="budgetMax">
            Maximum budget
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-900"
            id="budgetMax"
            min="0"
            step="1"
            type="number"
            {...register("budgetMax")}
          />
          <FieldError message={errors.budgetMax?.message} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">Choose your map location</h2>
            <p className="text-sm leading-6 text-zinc-600">
              Click the map to drop a marker where producers should discover you.
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-700">
            {Number(latitude).toFixed(4)}, {Number(longitude).toFixed(4)}
          </div>
        </div>

        {mapboxToken ? (
          <div className="overflow-hidden rounded-[2rem] border border-zinc-200">
            <Map
              initialViewState={defaultLocation}
              mapStyle="mapbox://styles/mapbox/streets-v12"
              mapboxAccessToken={mapboxToken}
              onClick={(event) => {
                setValue("latitude", Number(event.lngLat.lat), {
                  shouldValidate: true,
                });
                setValue("longitude", Number(event.lngLat.lng), {
                  shouldValidate: true,
                });
              }}
              style={{ width: "100%", height: 360 }}
            >
              <Marker latitude={Number(latitude)} longitude={Number(longitude)} />
            </Map>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm leading-6 text-zinc-600">
            Add <code className="rounded bg-white px-1.5 py-0.5">NEXT_PUBLIC_MAPBOX_TOKEN</code> to enable the map picker. The latitude and longitude fields below still work.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-zinc-900" htmlFor="latitude">
              Latitude
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-900"
              id="latitude"
              step="0.000001"
              type="number"
              {...register("latitude")}
            />
            <FieldError message={errors.latitude?.message} />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-900" htmlFor="longitude">
              Longitude
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-900"
              id="longitude"
              step="0.000001"
              type="number"
              {...register("longitude")}
            />
            <FieldError message={errors.longitude?.message} />
          </div>
        </div>
      </section>

      <section>
        <label className="text-sm font-medium text-zinc-900" htmlFor="portfolioFiles">
          Portfolio images
        </label>
        <input
          accept="image/*"
          className="mt-2 block w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-950 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
          id="portfolioFiles"
          multiple
          type="file"
          onChange={(event) => {
            setValue("portfolioFiles", Array.from(event.target.files || []), {
              shouldValidate: true,
            });
          }}
        />
        <FieldError message={errors.portfolioFiles?.message} />

        {previews.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {previews.map((preview) => (
              <div
                key={`${preview.name}-${preview.url}`}
                className="overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-zinc-50"
              >
                <Image
                  alt={preview.name}
                  className="h-36 w-full object-cover"
                  src={preview.url}
                  unoptimized
                  width={400}
                  height={240}
                />
                <p className="truncate px-4 py-3 text-sm text-zinc-700">{preview.name}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {serverError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      ) : null}

      <button
        className="inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={isSubmitting || isPending}
        type="submit"
      >
        {isSubmitting || isPending ? "Saving profile..." : "Create creator profile"}
      </button>
    </form>
  );
}
