import React, { useEffect, useState } from 'react';
import { SectionTitle } from './SectionTitle';
import { GlowingCard } from './GlowingCard';
import { GitHubHeatmap } from './GitHubHeatmap';
import { LeetCodeCard } from './LeetCodeCard';
import { config } from '../constants/config';
import { GitBranch, Star, Users, Code } from 'lucide-react';

interface GithubData {
  publicRepos: number;
  followers: number;
  totalStars: number;
  topLanguages: string[];
}

const fallbackData: GithubData = {
  publicRepos: 22,
  followers: 45,
  totalStars: 58,
  topLanguages: ["Dart", "TypeScript", "Python", "C++"]
};

export const GitHubStats: React.FC = () => {
  const [data, setData] = useState<GithubData>(fallbackData);
  const [loading, setLoading] = useState(true);
  const username = config.githubUsername;

  useEffect(() => {
    const fetchGithubStats = async () => {
      try {
        // Fetch user base details
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error("Failed to fetch user profiles");
        const userData = await userRes.json();

        // Fetch repos to sum stars and compute top languages
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (!reposRes.ok) throw new Error("Failed to fetch repositories");
        const reposData = await reposRes.json() as any[];

        let stars = 0;
        const languagesMap: { [key: string]: number } = {};

        reposData.forEach((repo) => {
          stars += repo.stargazers_count;
          if (repo.language) {
            languagesMap[repo.language] = (languagesMap[repo.language] || 0) + 1;
          }
        });

        const sortedLanguages = Object.entries(languagesMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([lang]) => lang);

        setData({
          publicRepos: userData.public_repos || fallbackData.publicRepos,
          followers: userData.followers || fallbackData.followers,
          totalStars: stars || fallbackData.totalStars,
          topLanguages: sortedLanguages.length > 0 ? sortedLanguages : fallbackData.topLanguages
        });
      } catch (err) {
        console.warn("GitHub API rate limits or network error. Using cached fallbacks.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGithubStats();
  }, [username]);

  return (
    <section 
      id="stats" 
      className="relative py-24 px-6 md:px-12 lg:px-24 bg-[#08090C] border-b border-borderMuted flex items-center justify-center"
    >
      <div className="w-full max-w-7xl relative z-10">
        <SectionTitle 
          number="05" 
          title="Open Source & Code Matrix" 
          subtitle="Dynamic GitHub repositories, real contribution matrix, and competitive programming analytics."
        />

        {/* Numeric stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          
          <GlowingCard className="p-6 flex items-center gap-4 min-h-[120px]">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-primary">
              <GitBranch className="w-6 h-6" />
            </div>
            <div>
              <span className="font-code text-xs text-textMuted block">Repositories</span>
              <span className="font-display font-extrabold text-2xl text-white">
                {loading ? fallbackData.publicRepos : data.publicRepos}
              </span>
            </div>
          </GlowingCard>

          <GlowingCard className="p-6 flex items-center gap-4 min-h-[120px]">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-secondary">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <span className="font-code text-xs text-textMuted block">Total Stars</span>
              <span className="font-display font-extrabold text-2xl text-white">
                {loading ? fallbackData.totalStars : data.totalStars}
              </span>
            </div>
          </GlowingCard>

          <GlowingCard className="p-6 flex items-center gap-4 min-h-[120px]">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-primary">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="font-code text-xs text-textMuted block">Followers</span>
              <span className="font-display font-extrabold text-2xl text-white">
                {loading ? fallbackData.followers : data.followers}
              </span>
            </div>
          </GlowingCard>

          <GlowingCard className="p-6 flex items-center gap-4 min-h-[120px]">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-secondary">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <span className="font-code text-xs text-textMuted block">Top Stack</span>
              <span className="font-display font-bold text-sm text-white truncate max-w-[140px] block">
                {loading ? fallbackData.topLanguages.join(', ') : data.topLanguages.join(', ')}
              </span>
            </div>
          </GlowingCard>

        </div>

        {/* Native GitHub Contribution Heatmap Matrix */}
        <GitHubHeatmap />

        {/* LeetCode Competitive Hub */}
        <LeetCodeCard />

      </div>
    </section>
  );
};
export default GitHubStats;
