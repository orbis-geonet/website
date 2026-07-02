import { getDictionary } from "@/lib/locales";
import { TUSERGROUP } from "@/lib/ts";
import { getData, getUsersGroupSchema, groupsMapper } from "@/lib/utils";
import { Groupcardsmall, ClientGroupFeed, Noexistence } from "@components";
import React from "react";

const Groups = async ({ params }: { params: { slug: string } }) => {
  const data = await getData(
    `profile/slug/${params.slug}/following?type=GROUP`,
  );
  const { dictionary } = await getDictionary();

  if (data.error)
    return (
      <main className="max-w-6xl mx-auto p-10 font-bold text-2xl">
        <Noexistence message="Something went wrong" />
      </main>
    );

  const groups: TUSERGROUP[] = groupsMapper(data);

  let usersGroupSchema;

  try {
    usersGroupSchema = await getUsersGroupSchema({
      userslug: params.slug,
      groups: groups,
    });
  } catch (err) {
    console.log(err);
  }

  return (
    <>
      {usersGroupSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(usersGroupSchema),
          }}
        />
      )}
      <section className="space-y-4 px-4 lg:px-0 sm:space-y-0 sm:grid grid-cols-2 min-[900px]:grid-cols-3 gap-3 gap-y-4 min-[900px]:gap-x-4 min-[900px]:gap-y-8 max-w-6xl mx-auto">
        {groups.map((group) => (
          <Groupcardsmall key={group.id} {...group} />
        ))}
        {groups.length === 0 ? (
          <Noexistence
            className="col-span-3"
            message={dictionary.errors.noGroups}
          />
        ) : (
          groups.length === 100 && (
            <ClientGroupFeed
              endpoint={`profile/slug/${params.slug}/following?type=GROUP`}
            />
          )
        )}
      </section>
    </>
  );
};

export default Groups;
