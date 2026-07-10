import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { contact } from "@/lib/constants/contact";
import { cn } from "@/lib/utils";

type ContactDetailsProps = {
  className?: string;
  variant?: "default" | "muted";
};

/** Reusable contact details block — address, phone, email, hours. */
export function ContactDetails({
  className,
  variant = "default",
}: ContactDetailsProps) {
  const textClass =
    variant === "muted" ? "text-muted-foreground" : "text-foreground";
  const linkClass =
    variant === "muted"
      ? "text-muted-foreground hover:text-primary"
      : "hover:text-primary";

  return (
    <ul className={cn("space-y-5", className)}>
      <li className="flex items-start gap-3">
        <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="text-sm font-semibold">Address</p>
          <p className={cn("mt-1 text-sm leading-relaxed", textClass)}>
            {contact.address}
          </p>
        </div>
      </li>
      <li className="flex items-start gap-3">
        <Phone className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="text-sm font-semibold">Phone</p>
          <a href={contact.phoneTel} className={cn("mt-1 block text-sm", linkClass)}>
            {contact.phone}
          </a>
        </div>
      </li>
      <li className="flex items-start gap-3">
        <Mail className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="text-sm font-semibold">Email</p>
          <a
            href={contact.emailMailto}
            className={cn("mt-1 block text-sm", linkClass)}
          >
            {contact.email}
          </a>
        </div>
      </li>
      <li className="flex items-start gap-3">
        <MessageCircle
          className="mt-0.5 size-5 shrink-0 text-primary"
          aria-hidden
        />
        <div>
          <p className="text-sm font-semibold">WhatsApp</p>
          <a
            href={contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("mt-1 block text-sm", linkClass)}
          >
            {contact.phone}
          </a>
        </div>
      </li>
      <li className="flex items-start gap-3">
        <Clock className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="text-sm font-semibold">Hours</p>
          <p className={cn("mt-1 text-sm", textClass)}>{contact.hours}</p>
        </div>
      </li>
    </ul>
  );
}
