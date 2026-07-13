export interface SocialLink {
  name: string;
  url: string;
  iconName: 'github' | 'linkedin' | 'leetcode' | 'instagram';
  label: string;
}

export const socials: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/arjunj08",
    iconName: "github",
    label: "arjunj08"
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/arjunj08/",
    iconName: "linkedin",
    label: "arjunj08"
  },
  {
    name: "LeetCode",
    url: "https://leetcode.com/u/arjun08j",
    iconName: "leetcode",
    label: "arjun08j"
  },
  {
    name: "Instagram",
    url: "https://instagram.com/jarjun08",
    iconName: "instagram",
    label: "jarjun08"
  }
];
