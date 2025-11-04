export function hardwarezoneNoOfLikes(summary: string): number {
  if (summary === "") return 0; // eg: ""

  // Assume usernames do NOT contain commas or spaces
  if (summary.includes(" and ")) {
    if (summary.includes(",")) {
      if (summary.includes(" other ") || summary.includes(" others ")) {
        return +summary.split(" and ")[1].split(" ")[0] + 3; // eg: CanT, waiken, OutBreak and 3 others
      } else return 3; // eg: "agent_719, Cowbellc and cyke69sg"
    } else return 2; // eg: "agent_719 and brownkai"
  } else return 1; // eg: "BambooGrove"
}
