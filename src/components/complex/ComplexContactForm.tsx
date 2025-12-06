import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSubmitLead } from "@/hooks/useSubmitLead";
import { Phone, Send, CheckCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Введите ваше имя"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ComplexContactFormProps {
  complexName: string;
  complexSlug: string;
}

export const ComplexContactForm = ({ complexName, complexSlug }: ComplexContactFormProps) => {
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

  const onSubmit = async (data: FormData) => {
    mutation.mutate({
      name: data.name,
      phone: data.phone,
      message: data.message || `Интересует ЖК «${complexName}»`,
      form_type: "complex_inquiry",
      form_source: `/novostroyki/${complexSlug}`,
    }, {
      onSuccess: () => {
        setIsSubmitted(true);
        form.reset();
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-serif font-semibold mb-2">Заявка отправлена!</h3>
        <p className="text-muted-foreground text-sm">
          Наш менеджер свяжется с вами в ближайшее время для консультации по ЖК «{complexName}»
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => setIsSubmitted(false)}
        >
          Отправить ещё заявку
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-xl font-serif font-semibold mb-2">
        Записаться на просмотр
      </h3>
      <p className="text-muted-foreground text-sm mb-6">
        Оставьте заявку и мы организуем экскурсию в ЖК «{complexName}»
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
                <FormLabel>Комментарий (необязательно)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Какие вопросы вас интересуют?"
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
            className="w-full gap-2"
            disabled={mutation.isPending}
          >
            <Send className="h-4 w-4" />
            {mutation.isPending ? "Отправка..." : "Отправить заявку"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground mb-3">Или позвоните нам:</p>
        <a 
          href="tel:+78121234567" 
          className="flex items-center gap-2 text-primary hover:underline font-medium"
        >
          <Phone className="h-4 w-4" />
          +7 (812) 123-45-67
        </a>
      </div>
    </div>
  );
};
