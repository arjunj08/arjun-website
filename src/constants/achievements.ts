export interface Achievement {
  id: string;
  value: number;
  suffix: string;
  title: string;
  subtitle: string;
  description: string;
}

export const achievements: Achievement[] = [
  {
    id: "products",
    value: 10,
    suffix: "+",
    title: "Products Shipped",
    subtitle: "End-to-End Production MVPs",
    description: "From concept to deployment, engineered high-fidelity web, mobile, and AI tools."
  },
  {
    id: "screens",
    value: 90,
    suffix: "+",
    title: "UI Screens Designed",
    subtitle: "SelfCall / Self OS Mobile App",
    description: "Designed a comprehensive design system with micro-interactions, dark modes, and flows."
  },
  {
    id: "leetcode",
    value: 500,
    suffix: "+",
    title: "LeetCode Solved",
    subtitle: "Competitive Programming",
    description: "Consistent problem solver under user handle arjun08j, focusing on graph theory and dynamic programming."
  },
  {
    id: "scholarships",
    value: 1,
    suffix: "",
    title: "ITS Surabaya Scholarship",
    subtitle: "CommTECH Camp 2026",
    description: "Selected for full scholarship representing university in Surabaya, Indonesia."
  }
];
