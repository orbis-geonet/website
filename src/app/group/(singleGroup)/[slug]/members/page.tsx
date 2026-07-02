import { ClientUserFeed, Noexistence, Usercard } from "@components";
import React from "react";
import { getData, getGroupMembersSchema, usersMapper } from "@/lib/utils";
import { BASE_URL, TUSER } from "@/lib/ts";
import { getDictionary } from "@/lib/locales";

const Members = async ({ params }: { params: { slug: string } }) => {
  const data = await getData(`groups/slug/${params.slug}/members`);
  const { dictionary } = await getDictionary();

  if (data.error)
    return (
      <main className="max-w-6xl mx-auto p-10 font-bold text-2xl">
        <Noexistence message="Something went wrong" />
      </main>
    );

  const members: TUSER[] = usersMapper(data);

  let groupMembersSchema;

  try {
    groupMembersSchema = await getGroupMembersSchema({
      url: `${BASE_URL}/group/${params.slug}`,
      members: members,
    });
  } catch (err) {
    // console.log(err);
  }

  return (
    <>
      {groupMembersSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(groupMembersSchema),
          }}
        />
      )}
      <section className="space-y-4 px-4 lg:px-0 sm:space-y-0 sm:grid grid-cols-2 min-[900px]:grid-cols-3 gap-3 gap-y-4 min-[900px]:gap-x-4 min-[900px]:gap-y-8 max-w-6xl mx-auto">
        {members.map((member) => (
          <Usercard key={member.id} {...member} />
        ))}
        {members.length === 0 ? (
          <Noexistence
            className="col-span-3"
            message={dictionary.errors.groupHasNoMembers}
          />
        ) : (
          members.length === 20 && (
            <ClientUserFeed endpoint={`groups/slug/${params.slug}/members`} />
          )
        )}
      </section>
    </>
  );
};

export default Members;
