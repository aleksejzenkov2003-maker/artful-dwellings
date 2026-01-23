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
  compact?: boolean;
}

export function BrokerContactForm({ brokerId, brokerName, brokerSlug, compact = false }: BrokerContactFormProps) {
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
      <div className={`bg-card border border-border rounded-lg text-center ${compact ? 'p-5' : 'p-8'}`}>
        <div className={`mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center ${compact ? 'w-12 h-12' : 'w-16 h-16'}`}>
          <CheckCircle2 className={compact ? 'w-6 h-6 text-primary' : 'w-8 h-8 text-primary'} />
        </div>
        <h3 className={`font-serif mb-2 ${compact ? 'text-lg' : 'text-xl'}`}>Заявка отправлена!</h3>
        <p className={`text-muted-foreground ${compact ? 'text-sm' : ''}`}>
          {brokerName} свяжется с вами в ближайшее время
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg ${compact ? 'p-4 md:p-5' : 'p-6 md:p-8'}`}>
      <h3 className={`font-serif mb-1 ${compact ? 'text-lg' : 'text-xl md:text-2xl'}`}>
        Связаться с {brokerName}
      </h3>
      <p className={`text-muted-foreground ${compact ? 'text-sm mb-4' : 'mb-6'}`}>
        Оставьте заявку и получите консультацию
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className={compact ? 'space-y-3' : 'space-y-4'}>
        <div className="space-y-1.5">
          <Label htmlFor="name" className={compact ? 'text-sm' : ''}>Ваше имя *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Введите имя"
            className={`${compact ? 'h-9 text-sm' : ''} ${errors.name ? "border-destructive" : ""}`}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className={compact ? 'text-sm' : ''}>Телефон *</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="+7 (___) ___-__-__"
            className={`${compact ? 'h-9 text-sm' : ''} ${errors.phone ? "border-destructive" : ""}`}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="message" className={compact ? 'text-sm' : ''}>Сообщение</Label>
          <Textarea
            id="message"
            {...register("message")}
            placeholder="Опишите вашу задачу..."
            rows={compact ? 2 : 3}
            className={compact ? 'text-sm' : ''}
          />
        </div>

        <Button
          type="submit"
          className={`w-full ${compact ? 'h-9 text-sm' : ''}`}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            "Отправка..."
          ) : (
            <>
              <Send className={compact ? 'w-3.5 h-3.5 mr-1.5' : 'w-4 h-4 mr-2'} />
              Отправить заявку
            </>
          )}
        </Button>

        <p className={`text-muted-foreground text-center ${compact ? 'text-[10px] leading-tight' : 'text-xs'}`}>
          Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
        </p>
      </form>
    </div>
  );
}
