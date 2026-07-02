import { TUSERGROUP } from "../../ts";

export const groupsMapper = (data: any) => {
  const groups: TUSERGROUP[] = data.map((group: any) => {
    const groupHolder: TUSERGROUP = {
      id: group.group?.groupKey,
      slug: group.group?.slug,
      name: group.group?.name,
      image: group.group?.imageName,
      color: group.group?.strokeColorHex,
      description: group.group?.description,
    };
    return groupHolder;
  });

  return groups ? groups : [];
};
