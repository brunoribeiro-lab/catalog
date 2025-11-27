"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/language/Switcher';
import { Google, Facebook, LinkedIn, Github } from "@/components/ui/icons";
import Input from '@/components/ui/Input';

interface LoginForm {
  email: string;
  password: string;
}

export default function Home() {
  const t = useTranslations();

  const [formData, setFormData] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginForm]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};
    if (!formData.email) newErrors.email = t("errors.emailRequired");
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t("errors.emailInvalid");

    if (!formData.password) newErrors.password = t("errors.passwordRequired");
    else if (formData.password.length < 6) newErrors.password = t("errors.passwordMin", { min: 6 });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ email: data.message || t("errors.loginFailed"), password: data.message || t("errors.loginFailed") });
      } else {
        console.log("Login successful", data);
      }
    } catch (err) {
      setErrors({ email: t("errors.network"), password: t("errors.network") });
    } finally {
      setIsLoading(false);
    }
  };

  const providers = { Google, Facebook, LinkedIn, Github };

  return (
    <div className="login-background">
      <div className="min-h-screen border-gradient-1 flex items-center justify-center p-4">
        <div className="max-w-xl w-full card-login rounded-2xl shadow-lg overflow-visible border-t-4 border-blue-500 relative">
          <div className="flex justify-between items-start p-4 pb-0">
            <div className="p-4 pt-2 flex-1">
              <h4 className="text-2xl font-bold text-gray-400">{t("login.getStarted")}</h4>
              <p className="text-gray-300 mt-2">{t("login.enterCredentials")}</p>
            </div>
            <div className="p-4 pt-2">
              <LanguageSwitcher />
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={t("login.email")}
                type="email"
                id="email"
                name="email"
                placeholder={t("login.emailPlaceholder")}
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
              />

              <Input
                label={t("login.password")}
                type="password"
                id="password"
                name="password"
                placeholder={t("login.passwordPlaceholder")}
                value={formData.password}
                onChange={handleInputChange}
                showPasswordToggle
                error={errors.password}
              />

              <div className="flex justify-between items-center">
                <a href="#" className="text-sm text-blue-500 hover:text-blue-700 transition duration-200">
                  {t("login.forgotPassword")}
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t("login.signingIn") : t("login.loginButton")}
              </button>

              <div className="text-center">
                <p className="text-gray-300 text-sm">
                  {t("login.dontHaveAccount")} <a href="#" className="text-blue-500 hover:text-blue-700 font-medium">{t("login.signUpHere")}</a>
                </p>
              </div>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-300 text-sm font-semibold">{t("login.orSignInWith")}</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="flex justify-center space-x-4">
              {Object.entries(providers).map(([name, IconCmp]) => (
                <button key={name} className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                  <IconCmp size={20} className="text-gray-700" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
