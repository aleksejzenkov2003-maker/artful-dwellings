import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubmitLead } from "@/hooks/useSubmitLead";

const formSchema = z.object({
  name: z.string().min(2, "Введите ваше имя"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
});

type FormData = z.infer<typeof formSchema>;

interface CallbackDialogProps {
  children: React.ReactNode;
}

export function CallbackDialog({ children }: CallbackDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const mutation = useSubmitLead();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      {
        name: data.name,
        phone: data.phone,
        form_type: "callback",
        form_source: window.location.pathname,
      },
      {
        onSuccess: () => {
          setIsSubmitted(true);
          reset();
          setTimeout(() => {
            setOpen(false);
            setIsSubmitted(false);
          }, 2000);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Phone className="h-5 w-5 text-primary" />
            Заказать обратный звонок
          </DialogTitle>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Заявка отправлена!</h3>
            <p className="text-muted-foreground">
              Мы перезвоним вам в ближайшее время
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div>
              <Input
                placeholder="Ваше имя"
                {...register("name")}
                className="h-12"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Input
                placeholder="Телефон"
                type="tel"
                {...register("phone")}
                className="h-12"
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-12"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Отправка..." : "Перезвоните мне"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
