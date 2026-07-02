import { TSEARCHRESULTGROUP } from "../../ts";

export const searchResultsMapper = (data: any) => {
  const searchResults: TSEARCHRESULTGROUP[] = data.map((group: any) => {
    const groupHolder: TSEARCHRESULTGROUP = {
      id: group.groupKey,
      slug: group.slug,
      name: group.name,
      image: group.imageName,
      color: group.strokeColorHex,
      membersCount: group.membersCount,
      placesCount: group.placesCount,
      description: group.description,
    };
    return groupHolder;
  });

  return searchResults ? searchResults : [];
};
