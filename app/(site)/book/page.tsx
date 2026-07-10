import { BookingWizard } from "@/components/booking/booking-wizard";

export default function BookPage() {
  return (
    <section className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgb(17 122 61 / 0.35), transparent)",
        }}
      />
      <div className="relative">
        <header className="mb-8 text-center sm:mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--landing-green)]">
            Book Your Slot
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Reserve Kidza Arena
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/60 sm:text-lg">
            A guided booking experience — choose your session, pick a time, and
            we&apos;ll take care of the rest.
          </p>
        </header>
        <BookingWizard />
      </div>
    </section>
  );
}
