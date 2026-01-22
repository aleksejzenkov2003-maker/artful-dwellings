import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSubmitLead } from "@/hooks/useSubmitLead";
import { CheckCircle2, Send } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Введите имя"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface BrokerContactFormProps {
  brokerId: string;
  brokerName: string;
  brokerSlug: string;
}

export function BrokerContactForm({ brokerId, brokerName, brokerSlug }: BrokerContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const mutation = useSubmitLead();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      {
        name: data.name,
        phone: data.phone,
        message: data.message || null,
        form_type: "broker_contact",
        form_source: `/broker/${brokerSlug}`,
        broker_id: brokerId,
      },
      {
        onSuccess: () => {
          setIsSubmitted(true);
          reset();
        },
      }
    );
  };

  if (isSubmitted) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-serif mb-2">Заявка отправлена!</h3>
        <p className="text-muted-foreground">
          {brokerName} свяжется с вами в ближайшее время
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 md:p-8">
      <h3 className="text-xl md:text-2xl font-serif mb-2">
        Связаться с {brokerName}
      </h3>
      <p className="text-muted-foreground mb-6">
        Оставьте заявку и получите консультацию
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ваше имя *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Введите имя"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Телефон *</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="+7 (___) ___-__-__"
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Сообщение</Label>
          <Textarea
            id="message"
            {...register("message")}
            placeholder="Опишите вашу задачу или вопрос..."
            rows={3}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            "Отправка..."
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Отправить заявку
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
        </p>
      </form>
    </div>
  );
}
