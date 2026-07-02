import { getDictionary } from "@/lib/locales";
import { BASE_URL } from "@/lib/ts";
import {
  getAllPageSchema,
  getData,
  getSubscriptionPageSchema,
  getURL,
} from "@/lib/utils";
import { BacktoGroupButton, Paymentplancard } from "@components";
import { METAPROPS, TPLAN } from "@interface";
import { Metadata } from "next";
import React from "react";

export const generateMetadata = async ({
  params,
}: METAPROPS): Promise<Metadata> => {
  const data = await getData(`groups/${params.id}`);
  const { dictionary } = await getDictionary();
  if (data.error) {
    return {};
  }

  const image = await getURL(`groupPictures/${data.imageName}`);

  const title = data.name
    ? `${dictionary.plansPage.metaTitle} | ${data.name}`
    : dictionary.plansPage.metaTitle;

  const description = data.description;

  return {
    title: title,
    openGraph: {
      title: title,
      description: description ? description : "",
      images: [image],
      type: "website",
      url: `${BASE_URL}/plans/${params.id}`,
    },
  };
};

const Plans = async ({ params }: { params: { id: string } }) => {
  const planData = await getData(`groups/subscription/${params.id}`, false);
  const { dictionary } = await getDictionary();
  if (planData.error)
    return (
      <main className="max-w-6xl mx-auto p-10 font-bold text-2xl">
        Something went wrong
      </main>
    );

  const plans: TPLAN[] = planData.map((plan: any) => {
    return {
      id: plan.subscriptionKey,
      title: plan.name,
      description: plan.description,
      features: plan.benefit ? plan.benefit : [],
      currency: plan.currency,
      price: plan.price,
      type: plan.type ? plan.type : "UNLIMITED",
      interval: plan.interval ? plan.interval : "MONTH",
      period: plan.period,
      images: plan.imagesName?.map(
        (image: string) => `groups/subscription/images/${image}`,
      ),
    };
  });

  let subscriptionPageSchema;
  try {
    const subscriptionPageSchemaOptions = {
      groupId: params.id,
      plans: plans,
    };

    subscriptionPageSchema = await getSubscriptionPageSchema(
      subscriptionPageSchemaOptions,
    );
  } catch (error) {
    // console.log(error);
  }

  return (
    <>
      {subscriptionPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(subscriptionPageSchema),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getAllPageSchema({ url: `${BASE_URL}/plans/${params.id}` }),
          ),
        }}
      />
      <main className="mx-auto max-w-6xl pt-10 pb-20">
        <section className="mx-4 lg:mx-0 flex items-center pt-6 pb-14 relative">
          <BacktoGroupButton />
          <h1 className="text-2xl text-center font-bold flex-1 hidden min-[900px]:block">
            {dictionary.plansPage.heading}
          </h1>
        </section>
        <section className="mx-4 gap-4 lg:mx-0 flex lg:gap-6 overflow-x-auto py-4">
          {plans.map((plan: TPLAN) => (
            <Paymentplancard key={plan.id} {...plan} groupKey={params.id} />
          ))}
        </section>
      </main>
    </>
  );
};

export default Plans;
