import { ClientUserFeed, Noexistence, Usercard } from "@components";
import React from "react";
import { getData, usersMapper } from "@/lib/utils";
import { TUSER } from "@/lib/ts";
import { getDictionary } from "@/lib/locales";

const Followers = async ({ params }: { params: { slug: string } }) => {
  const data = await getData(`profile/slug/${params.slug}/followers`);
  const { dictionary } = await getDictionary();

  if (data.error)
    return (
      <main className="max-w-6xl mx-auto p-10 font-bold text-2xl">
        <Noexistence message="Something went wrong" />
      </main>
    );

  const followers: TUSER[] = usersMapper(data);

  return (
    <section className="space-y-4 px-4 lg:px-0 sm:space-y-0 sm:grid grid-cols-2 min-[900px]:grid-cols-3 gap-3 gap-y-4 min-[900px]:gap-x-4 min-[900px]:gap-y-8 max-w-6xl mx-auto">
      {followers.map((user) => (
        <Usercard key={user.id} {...user} />
      ))}
      {followers.length === 0 ? (
        <Noexistence
          className="col-span-3"
          message={dictionary.errors.noFollowers}
        />
      ) : (
        followers.length === 100 && (
          <ClientUserFeed endpoint={`profile/slug/${params.slug}/followers`} />
        )
      )}
    </section>
  );
};

export default Followers;
