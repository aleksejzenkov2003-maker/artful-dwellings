import { useState } from "react";
import { FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubmitLead } from "@/hooks/useSubmitLead";
import { ComplexPdfGenerator } from "./ComplexPdfGenerator";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexPresentationButtonProps {
  complex: ResidentialComplex;
}

export const ComplexPresentationButton = ({ complex }: ComplexPresentationButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const mutation = useSubmitLead();
  const isPending = mutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) return;

    mutation.mutate({
      name: name.trim(),
      phone: phone.trim(),
      form_type: "presentation",
      form_source: `ЖК ${complex.name}`,
      message: `Запрос презентации ЖК ${complex.name}`,
    }, {
      onSuccess: () => {
        setIsSubmitted(true);
      }
    });
  };

  const handleDownload = () => {
    if (complex.presentation_url) {
      window.open(complex.presentation_url, "_blank");
    }
    setIsOpen(false);
    // Reset form state for next time
    setTimeout(() => {
      setIsSubmitted(false);
      setName("");
      setPhone("");
    }, 300);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-[14px] uppercase tracking-wider font-medium transition-colors"
      >
        <FileText className="w-4 h-4" />
        Скачать презентацию
      </button>
      <p className="text-white/50 text-[13px] mt-2">
        Скачайте полную презентацию дома с ценами
      </p>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">
              {isSubmitted ? "Спасибо за заявку!" : "Получить презентацию"}
            </DialogTitle>
          </DialogHeader>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Оставьте контактные данные, и мы отправим вам презентацию ЖК «{complex.name}»
              </p>

              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ваше имя"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Отправка..." : "Получить презентацию"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Ваша заявка принята! Скачайте презентацию прямо сейчас:
              </p>

              {complex.presentation_url ? (
                <Button onClick={handleDownload} className="w-full gap-2">
                  <FileText className="h-4 w-4" />
                  Скачать PDF
                </Button>
              ) : (
                <ComplexPdfGenerator complex={complex} />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
