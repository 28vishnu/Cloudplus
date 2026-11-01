import { useCallback, useEffect, useState } from 'react';
import { openUrl } from '@tauri-apps/plugin-opener';
import { CheckCircle2, ExternalLink, Heart, KeyRound, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useSupporter } from '../../context/SupporterContext';
import { Trans, useTranslation } from 'react-i18next';
import { supporterErrorMessage, supporterPaymentMessage, supporterStatusMessage } from '../../services/supporterMessages';

const SUPPORT_URL = 'https://www.cameronamer.com';

export function MobileSupporterCard() {
  const { t } = useTranslation();
  const { status, latestRecoveryCode, beginCheckout, pollCheckout, activate, refreshEntitlement, refreshStatus } = useSupporter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [busy, setBusy] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newRecoveryCode, setNewRecoveryCode] = useState('');
  const termsUrl = status.terms_url ?? 'https://github.com/caamer20/Telegram-Drive/blob/main/SUPPORTER_TERMS.md';
  const canRestore = !status.ad_free && !status.checkout_pending && !['loading', 'revoked', 'unavailable'].includes(status.state);
  const canRefresh = ['active', 'needs_refresh', 'expired'].includes(status.state);

  useEffect(() => setCheckoutPending(Boolean(status.checkout_pending)), [status.checkout_pending]);

  const checkPayment = useCallback(async (quiet = false) => {
    try {
      const result = await pollCheckout();
      if (result.status === 'completed') {
        setCheckoutPending(false);
        if (result.recovery_code) setNewRecoveryCode(result.recovery_code);
        toast.success(supporterPaymentMessage(result, t));
      } else if (result.status === 'failed' || result.status === 'expired') {
        setCheckoutPending(false);
        await refreshStatus();
        if (!quiet) toast.error(supporterPaymentMessage(result, t));
      } else if (!quiet) {
        toast.info(supporterPaymentMessage(result, t));
      }
    } catch (error) {
      if (!quiet) toast.error(supporterErrorMessage(error, t));
    }
  }, [pollCheckout, refreshStatus, t]);

  const resumeExistingCheckout = async () => {
    setBusy(true);
    try {
      const checkout = await beginCheckout(status.terms_version);
      await openUrl(checkout.approval_url);
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

  return (
    <section id="mobile-supporter-card" className="rounded-2xl border border-telegram-primary/25 bg-telegram-primary/5 p-4" aria-labelledby="android-supporter-title">
      <div className="flex items-start gap-3">
        <Heart className="mt-0.5 h-5 w-5 flex-none text-telegram-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h2 id="android-supporter-title" className="text-sm font-semibold text-telegram-text">{t('supporter_license.nav_title')}</h2>
        </div>
      </div>

      <div className={`mt-3 rounded-xl border p-3 text-[11px] leading-5 ${status.ad_free ? 'border-emerald-400/25 bg-emerald-400/10' : 'border-telegram-border/30 bg-telegram-bg/45'}`}>
        <div className="flex items-center gap-2 font-semibold text-telegram-text">
          {status.state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : status.ad_free ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <KeyRound className="h-4 w-4 text-telegram-primary" />}
          {status.state === 'loading' ? t('supporter_license.checking') : status.ad_free ? t('supporter_license.active') : status.state === 'revoked' ? t('supporter_license.revoked') : status.state === 'expired' ? t('supporter_license.expired') : status.state === 'unavailable' ? t('supporter_license.unavailable') : status.recovery_code_saved ? t('supporter_license.previous_purchase') : t('supporter_license.inactive')}
        </div>
        <p className="mt-1 text-telegram-subtext">{supporterStatusMessage(status, t)}</p>
        {status.ad_free && <p className="mt-1 text-telegram-subtext">{t('supporter_license.android_updates_preserved')}</p>}
      </div>

      {(newRecoveryCode || latestRecoveryCode) && <div className="mt-3 rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-[11px] leading-5 text-telegram-subtext">
        <strong className="text-telegram-text">{t('supporter_license.save_recovery')}</strong>
        <code className="mt-2 block select-all break-all rounded-lg bg-telegram-bg/70 px-3 py-2 font-mono text-xs text-telegram-text">{newRecoveryCode || latestRecoveryCode}</code>
        <p className="mt-2">{t('supporter_license.recovery_storage_android')}</p>
      </div>}

      {checkoutPending && <div className="mt-3 rounded-xl border border-telegram-primary/25 bg-telegram-primary/10 p-3 text-[11px] leading-5 text-telegram-subtext" role="status">
        <strong className="text-telegram-text">{t('supporter_license.waiting_payment')}</strong>
        <p>{t('supporter_license.waiting_payment_android')}</p>
      </div>}

      {canRestore && <label className="mt-4 flex items-start gap-2 text-[10px] leading-4 text-telegram-subtext">
        <input type="checkbox" checked={acceptedTerms} onChange={event => setAcceptedTerms(event.target.checked)} className="mt-0.5 accent-[var(--color-telegram-primary)]" />
        <span><Trans i18nKey="supporter_license.consent_mobile" components={{ terms: <button type="button" onClick={event => { event.preventDefault(); void openUrl(termsUrl); }} className="text-telegram-primary underline" /> }} /></span>
      </label>}

      <div className="mt-4 flex flex-wrap gap-2">
        {checkoutPending && <><button type="button" disabled={busy} onClick={() => void resumeExistingCheckout()} className="rounded-xl border border-telegram-border/40 px-3 py-2.5 text-[11px] font-semibold text-telegram-text">{t('supporter_offer.resume_checkout')}</button><button type="button" onClick={() => void checkPayment()} className="rounded-xl border border-telegram-border/40 px-3 py-2.5 text-[11px] font-semibold text-telegram-text">{t('supporter_license.check_payment')}</button></>}
        {canRefresh && <button type="button" onClick={() => void refreshEntitlement().then(() => toast.success(t('supporter_license.verification_refreshed'))).catch(error => toast.error(supporterErrorMessage(error, t)))} className="flex items-center gap-1.5 rounded-xl border border-telegram-border/40 px-3 py-2.5 text-[11px] font-semibold text-telegram-text"><RefreshCw className="h-3.5 w-3.5" />{t('supporter_license.refresh_verification')}</button>}
        <button type="button" onClick={() => void openUrl(termsUrl)} className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-[11px] text-telegram-primary"><ExternalLink className="h-3.5 w-3.5" />{t('supporter_license.terms_action')}</button>
      </div>

      {canRestore && <details className="mt-4 rounded-xl border border-telegram-border/30 bg-telegram-bg/45 p-3">
        <summary className="cursor-pointer text-[11px] font-semibold text-telegram-text">{t('supporter_license.restore_heading_mobile')}</summary>
        <p className="mt-2 text-[10px] leading-4 text-telegram-subtext">{t('supporter_license.restore_description_mobile')}</p>
        <input value={recoveryCode} onChange={event => setRecoveryCode(event.target.value)} aria-label={t('supporter_license.recovery_code_label')} placeholder="XXXXX-XXXXX-XXXXX-XXXXX" autoComplete="off" spellCheck={false} className="mt-3 w-full rounded-xl border border-telegram-border/40 bg-telegram-bg px-3 py-2.5 text-xs text-telegram-text outline-none focus:border-telegram-primary" />
        <button type="button" disabled={!acceptedTerms || !recoveryCode.trim() || busy} onClick={() => void restorePurchase()} className="mt-2 w-full rounded-xl border border-telegram-primary/30 bg-telegram-primary/10 px-3 py-2.5 text-[11px] font-semibold text-telegram-primary disabled:opacity-50">{t('supporter_license.restore_action_mobile')}</button>
      </details>}

      {status.state === 'unavailable' && <button type="button" onClick={() => void openUrl(SUPPORT_URL)} className="mt-3 text-[10px] text-telegram-primary underline">{t('supporter_license.help_action')}</button>}
    </section>
  );
}
