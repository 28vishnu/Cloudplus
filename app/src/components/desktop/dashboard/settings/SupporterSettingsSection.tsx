import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { CheckCircle2, Heart, KeyRound, RefreshCw } from 'lucide-react';
import { open } from '@tauri-apps/plugin-shell';
import { toast } from 'sonner';
import { useSupporter } from '../../../../context/SupporterContext';
import { supporterErrorMessage, supporterPaymentMessage, supporterStatusMessage } from '../../../../services/supporterMessages';

export function SupporterSettingsSection() {
  const { t } = useTranslation();
  const { status, latestRecoveryCode, beginCheckout, pollCheckout, activate, refreshEntitlement } = useSupporter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [busy, setBusy] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newRecoveryCode, setNewRecoveryCode] = useState('');
  const termsUrl = status.terms_url ?? 'https://github.com/caamer20/Telegram-Drive/blob/main/SUPPORTER_TERMS.md';
  const supportUrl = 'https://www.cameronamer.com';
  const canRefresh = ['active', 'needs_refresh', 'expired'].includes(status.state);
  const canRestore = !status.ad_free && !['loading', 'unavailable', 'revoked'].includes(status.state);

  useEffect(() => setCheckoutPending(Boolean(status.checkout_pending)), [status.checkout_pending]);

  const checkPayment = async () => {
    try {
      const result = await pollCheckout();
      if (result.status === 'completed') {
        setCheckoutPending(false);
        if (result.recovery_code) setNewRecoveryCode(result.recovery_code);
        toast.success(supporterPaymentMessage(result, t));
      } else if (result.status === 'failed' || result.status === 'expired') {
        setCheckoutPending(false);
        toast.error(supporterPaymentMessage(result, t));
      } else {
        toast.info(supporterPaymentMessage(result, t));
      }
    } catch (error) {
      toast.error(supporterErrorMessage(error, t));
    }
  };

  const resumeExistingCheckout = async () => {
    setBusy(true);
    try {
      const checkout = await beginCheckout(status.terms_version);
      await open(checkout.approval_url);
    } catch (error) {
      toast.error(supporterErrorMessage(error, t));
    } finally {
      setBusy(false);
    }
  };

  const restorePurchase = async () => {
    if (!recoveryCode.trim()) return;
    setBusy(true);
    try {
      await activate(recoveryCode.trim(), status.terms_version);
      setRecoveryCode('');
      toast.success(t('supporter_license.purchase_restored'));
    } catch (error) {
      toast.error(supporterErrorMessage(error, t));
    } finally {
      setBusy(false);
    }
  };

  const recoveryNotice = (newRecoveryCode || latestRecoveryCode) && (
    <div className="mt-4 rounded-lg border border-app-warning/30 bg-app-warning/5 p-3 text-xs leading-5 text-app-text-secondary">
      <strong className="text-app-text">{t('supporter_license.save_recovery')}</strong>
      <code dir="ltr" className="mt-2 block select-all break-all rounded bg-app-surface-sunken px-3 py-2 font-mono text-sm text-app-text">{newRecoveryCode || latestRecoveryCode}</code>
      <p className="mt-2">{t('supporter_license.recovery_storage_desktop')}</p>
    </div>
  );

  if (status.ad_free) {
    return (
      <section id="desktop-supporter-section" tabIndex={-1} className="rounded-lg border border-app-success/25 bg-app-success/5 p-4" aria-labelledby="supporter-settings-title">
        <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-app-success" aria-hidden="true" /><h3 id="supporter-settings-title" className="text-sm font-semibold text-app-text">{t('supporter_license.purchased_title')}</h3></div>
        {recoveryNotice}
        <details className="mt-4 text-xs leading-5 text-app-text-secondary">
          <summary className="cursor-pointer font-medium text-app-text">{t('supporter_license.manage_license')}</summary>
          <p className="mt-3">{supporterStatusMessage(status, t)}</p>
          <p className="mt-2">{t('supporter_license.updates_preserved')}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {canRefresh && <button type="button" onClick={() => void refreshEntitlement().then(() => toast.success(t('supporter_license.verification_refreshed'))).catch(error => toast.error(supporterErrorMessage(error, t)))} className="quiet-control px-4 py-2.5 text-xs font-medium text-app-text"><RefreshCw className="me-1 inline h-3.5 w-3.5" />{t('supporter_license.refresh_verification')}</button>}
            <button type="button" onClick={() => void open(termsUrl)} className="quiet-control px-3 py-2.5 text-xs text-app-text-secondary">{t('supporter_license.terms_action')}</button>
            <button type="button" onClick={() => void open(supportUrl)} className="quiet-control px-3 py-2.5 text-xs text-app-text-secondary">{t('supporter_license.help_action')}</button>
          </div>
        </details>
      </section>
    );
  }

  return (
    <section id="desktop-supporter-section" tabIndex={-1} className="rounded-lg border border-app-border bg-app-surface p-4" aria-labelledby="supporter-settings-title">
      <div className="flex items-start gap-3">
        <Heart className="mt-0.5 h-5 w-5 shrink-0 text-app-accent" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h3 id="supporter-settings-title" className="text-sm font-semibold text-app-text">{t('supporter_license.nav_title')}</h3>
          <div className={`mt-3 rounded-lg border p-3 text-xs leading-5 text-app-text-secondary ${status.state === 'revoked' ? 'border-app-danger/25 bg-app-danger/5' : 'border-app-border-subtle bg-app-surface-sunken/25'}`}>
            <strong className={status.state === 'revoked' ? 'text-app-danger' : 'text-app-text'}>{status.state === 'loading' ? t('supporter_license.checking') : status.state === 'revoked' ? t('supporter_license.revoked') : status.state === 'expired' ? t('supporter_license.expired') : status.state === 'unavailable' ? t('supporter_license.unavailable') : status.recovery_code_saved ? t('supporter_license.previous_purchase') : t('supporter_license.inactive')}</strong>
            <span className="mt-1 block">{supporterStatusMessage(status, t)}</span>
            {status.recovery_code_saved && !status.ad_free && <span className="mt-1 block font-medium text-app-text">{t('supporter_license.returning_warning')}</span>}
          </div>
        </div>
      </div>

      {recoveryNotice}
      {checkoutPending && <div role="status" className="mt-4 rounded-lg border border-app-accent/25 bg-app-accent/5 p-3 text-xs leading-5 text-app-text-secondary"><strong className="text-app-text">{t('supporter_license.waiting_payment')}</strong><p className="mt-1">{t('supporter_license.waiting_payment_desktop')}</p></div>}
      {canRestore && <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs leading-5 text-app-text-secondary"><input type="checkbox" checked={acceptedTerms} onChange={event => setAcceptedTerms(event.target.checked)} className="mt-1 accent-[var(--color-app-accent)]" /><span><Trans t={t} i18nKey="supporter_license.consent_desktop" components={{ terms: <button type="button" onClick={event => { event.preventDefault(); void open(termsUrl); }} className="text-app-accent underline underline-offset-2" /> }} /></span></label>}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {checkoutPending && <><button type="button" disabled={busy} onClick={() => void resumeExistingCheckout()} className="quiet-control px-4 py-2.5 text-xs font-medium text-app-text">{t('supporter_offer.resume_checkout')}</button><button type="button" onClick={() => void checkPayment()} className="quiet-control px-4 py-2.5 text-xs font-medium text-app-text">{t('supporter_license.check_payment')}</button></>}
        {canRefresh && <button type="button" onClick={() => void refreshEntitlement().then(() => toast.success(t('supporter_license.verification_refreshed'))).catch(error => toast.error(supporterErrorMessage(error, t)))} className="quiet-control px-4 py-2.5 text-xs font-medium text-app-text">{t('supporter_license.refresh_verification')}</button>}
        <button type="button" onClick={() => void open(termsUrl)} className="quiet-control px-3 py-2.5 text-xs text-app-text-secondary">{t('supporter_license.terms_action')}</button>
        <button type="button" onClick={() => void open(supportUrl)} className="quiet-control px-3 py-2.5 text-xs text-app-text-secondary">{t('supporter_license.help_action')}</button>
      </div>

      {canRestore && <details className="mt-4 rounded-lg border border-app-border-subtle bg-app-surface-sunken/20 p-3">
        <summary className="cursor-pointer text-xs font-medium text-app-text">{t('supporter_license.restore_heading_desktop')}</summary>
        <p className="mt-2 text-xs leading-5 text-app-text-secondary">{t('supporter_license.restore_description_desktop')}</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input dir="ltr" aria-label={t('supporter_license.recovery_code_label')} value={recoveryCode} onChange={event => setRecoveryCode(event.target.value)} placeholder={t('supporter_license.recovery_example')} autoComplete="off" spellCheck={false} className="min-w-0 flex-1 rounded-control border border-app-border bg-app-surface px-3 py-2 text-xs text-app-text outline-none focus:border-app-accent" />
          <button type="button" disabled={!acceptedTerms || !recoveryCode.trim() || busy} onClick={() => void restorePurchase()} className="quiet-control px-4 py-2 text-xs font-medium text-app-text disabled:opacity-50">{t('supporter_license.restore_action_desktop')}</button>
        </div>
        <p className="mt-2 text-xs leading-5 text-app-text-tertiary">{t('supporter_license.restore_help')}</p>
      </details>}
    </section>
  );
}
