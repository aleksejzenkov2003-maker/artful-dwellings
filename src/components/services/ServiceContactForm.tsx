import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSubmitLead } from "@/hooks/useSubmitLead";
import { CheckCircle, Phone } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Введите ваше имя").max(100),
  phone: z.string().min(10, "Введите корректный номер телефона").max(20),
  message: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ServiceContactFormProps {
  serviceTitle: string;
  serviceSlug: string;
}

export function ServiceContactForm({ serviceTitle, serviceSlug }: ServiceContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const mutation = useSubmitLead();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      {
        name: data.name,
        phone: data.phone,
        message: data.message || null,
        email: null,
        form_type: "service",
        form_source: `Услуга: ${serviceTitle} (${serviceSlug})`,
      },
      {
        onSuccess: () => {
          setIsSubmitted(true);
          form.reset();
        },
      }
    );
  };

  if (isSubmitted) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-serif font-semibold mb-2">
          Заявка отправлена!
        </h3>
        <p className="text-muted-foreground">
          Мы свяжемся с вами в ближайшее время
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
      <h3 className="text-xl font-serif font-semibold mb-4">
        Заказать услугу
      </h3>
      <p className="text-muted-foreground text-sm mb-6">
        Оставьте заявку и мы свяжемся с вами в ближайшее время
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ваше имя</FormLabel>
                <FormControl>
                  <Input placeholder="Иван Иванов" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон</FormLabel>
                <FormControl>
                  <Input placeholder="+7 (999) 123-45-67" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Сообщение (опционально)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Опишите вашу задачу..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Отправка..." : "Оставить заявку"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground mb-2">Или позвоните нам:</p>
        <a
          href="tel:+78123097474"
          className="flex items-center gap-2 text-primary font-medium hover:underline"
        >
          <Phone className="h-4 w-4" />
          +7 (812) 309-74-74
        </a>
      </div>
    </div>
  );
}
