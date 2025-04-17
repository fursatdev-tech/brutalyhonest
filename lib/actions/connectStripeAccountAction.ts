"use server";
import { User, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/actions/stripe";

export const connectStripeAccountAction = async () => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized" };

  try {
    const foundAccount = await prismadb.stripeAccount.findUnique({
      where: { userId: user.id },
      select: { stripeAccountId: true },
    });

    const url = await createOrUpodateStripeAccount(
      user,
      foundAccount?.stripeAccountId
    );

    return { url };
  } catch (error: any) {
    return { error: `${error.message}` };
  }
};

const createOrUpodateStripeAccount = async (
  user: User,
  stripeAccountId?: string
) => {
  if (!stripeAccountId) {
    const account: Stripe.Response<Stripe.Account> =
      await stripe.accounts.create({
        type: "standard",
        country: "IN",
        email: user.emailAddresses[0].emailAddress,
        business_profile: {
          url: process.env.META_URL,
        },
      });

    stripeAccountId = account.id;

    await prismadb.stripeAccount.create({
      data: { userId: user.id, stripeAccountId },
    });
  }

  const { url } = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${process.env.META_URL}/hosting`,
    return_url: `${process.env.META_URL}/hosting`,
    type: "account_onboarding",
  });

  return url;
};

// {
// id: 'acct_1OhWgcSD5NcLNmMH',
//   object: 'account',
//   business_profile: {
//     annual_revenue: null,
//     estimated_worker_count: null,
//     mcc: null,
//     name: null,
//     product_description: null,
//     support_address: null,
//     support_email: null,
//     support_phone: null,
//     support_url: null,
//     url: null
//   },
//   business_type: null,
//   capabilities: {},
//   charges_enabled: false,
//   controller: { is_controller: true, type: 'application' },
//   country: 'IN',
//   created: 1707395205,
//   default_currency: 'inr',
//   details_submitted: false,
//   email: 'pankajyadav.code@gmail.com',
//   external_accounts: {
//     object: 'list',
//     data: [],
//     has_more: false,
//     total_count: 0,
//     url: '/v1/accounts/acct_1OhWgcSD5NcLNmMH/external_accounts'
//   },
//   future_requirements: {
//     alternatives: [],
//     current_deadline: null,
//     currently_due: [],
//     disabled_reason: null,
//     errors: [],
//     eventually_due: [],
//     past_due: [],
//     pending_verification: []
//   },
//   metadata: {},
//   payouts_enabled: false,
//   requirements: {
//     alternatives: [],
//     current_deadline: null,
//     currently_due: [
//       'business_profile.product_description',
//       'business_profile.support_phone',
//       'business_profile.url',
//       'external_account',
//       'tos_acceptance.date',
//       'tos_acceptance.ip'
//     ],
//     disabled_reason: 'requirements.past_due',
//     errors: [],
//     eventually_due: [
//       'business_profile.product_description',
//       'business_profile.support_phone',
//       'business_profile.url',
//       'external_account',
//       'tos_acceptance.date',
//       'tos_acceptance.ip'
//     ],
//     past_due: [ 'external_account', 'tos_acceptance.date', 'tos_acceptance.ip' ],
//     pending_verification: []
//   },
//   settings: {
//     bacs_debit_payments: { display_name: null, service_user_number: null },
//     branding: {
//       icon: 'file_1OhWgeSFtjDuslfE4f22oobn',
//       logo: 'file_1OhWgeSFtjDuslfEgtzVGE2W',
//       primary_color: '#ffffff',
//       secondary_color: '#ff5774'
//     },
//     card_issuing: { tos_acceptance: [Object] },
//     card_payments: {
//       decline_on: [Object],
//       statement_descriptor_prefix: null,
//       statement_descriptor_prefix_kana: null,
//       statement_descriptor_prefix_kanji: null
//     },
//     dashboard: { display_name: null, timezone: 'Etc/UTC' },
//     invoices: { default_account_tax_ids: null },
//     payments: {
//       statement_descriptor: null,
//       statement_descriptor_kana: null,
//       statement_descriptor_kanji: null
//     },
//     payouts: {
//       debit_negative_balances: true,
//       schedule: [Object],
//       statement_descriptor: null
//     },
//     sepa_debit_payments: {}
//   },
//   tos_acceptance: { date: null, ip: null, user_agent: null },
//   type: 'standard'
// }
