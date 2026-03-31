import React, { useState } from 'react';
import { Button } from './Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './Card';
import { Input, Textarea, Label } from './Input';
import { getTranslations } from '../i18n';

export const TicketForm = ({ onSubmit, loading = false, initialData = null, onCancel = null, theme = 'light', copy }) => {
  const isDark = theme === 'dark';
  const translations = copy || getTranslations('en');
  const t = translations.form;
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      description: '',
      contact_info: '',
    }
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.title.length < 5) newErrors.title = t.validationTitle;
    if (formData.description.length < 10) newErrors.description = t.validationDescription;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_info)) newErrors.contact_info = t.validationEmail;
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <Card theme={theme} className={`overflow-hidden shadow-2xl ${isDark ? 'border-stone-700/80 shadow-black/20' : 'border-stone-200/80 shadow-stone-900/5'}`}>
      <div className={`h-1 bg-gradient-to-r ${isDark ? 'from-amber-400 via-orange-400 to-rose-400' : 'from-amber-400 via-orange-400 to-rose-300'}`} />
      <CardHeader className={`${isDark ? 'bg-stone-950/40' : 'bg-white/60'}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className={isDark ? 'text-stone-50' : ''}>{initialData ? t.editTitle : t.createTitle}</CardTitle>
            <p className={`mt-1 text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              {initialData ? t.editDescription : t.createDescription}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isDark ? 'bg-amber-400 text-stone-950' : 'bg-stone-900 text-white'}`}>
            {t.badge}
          </span>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label theme={theme} htmlFor="title">{t.title}</Label>
              <Input
                theme={theme}
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={t.titlePlaceholder}
                autoComplete="off"
              />
              {errors.title && <p className="mt-2 text-sm text-rose-600">{errors.title}</p>}
            </div>

            <div>
              <Label theme={theme} htmlFor="contact_info">{t.contactEmail}</Label>
              <Input
                theme={theme}
                id="contact_info"
                name="contact_info"
                type="email"
                value={formData.contact_info}
                onChange={handleChange}
                placeholder={t.contactPlaceholder}
                autoComplete="email"
              />
              {errors.contact_info && <p className="mt-2 text-sm text-rose-600">{errors.contact_info}</p>}
            </div>
          </div>

          <div>
            <Label theme={theme} htmlFor="description">{t.description}</Label>
            <Textarea
              theme={theme}
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t.descriptionPlaceholder}
              rows="7"
            />
            <div className={`mt-2 flex items-center justify-between text-xs ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              <span>{t.minCharacters}</span>
              <span>{formData.description.length} {t.charactersSuffix}</span>
            </div>
            {errors.description && <p className="mt-2 text-sm text-rose-600">{errors.description}</p>}
          </div>
        </CardContent>

        <CardFooter className={isDark ? 'bg-stone-950/40' : 'bg-stone-50/80'}>
          {onCancel && (
            <Button theme={theme} type="button" variant="secondary" onClick={onCancel} disabled={loading}>
              {translations.actions.cancel}
            </Button>
          )}
          <Button theme={theme} type="submit" disabled={loading}>
            {loading ? translations.actions.save : initialData ? translations.actions.update : translations.actions.create}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
