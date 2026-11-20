import React from 'react';
import { GlowingCard } from './GlowingCard';
import { SiLeetcode } from 'react-icons/si';
import { Trophy, Zap, Target, ExternalLink } from 'lucide-react';
import { config } from '../constants/config';
import { sound } from '../utils/sound';

export const LeetCodeCard: React.FC = () => {
  const username = config.leetcodeUsername;

  const stats = {
    totalSolved: 348,
    easy: { solved: 142, total: 840, color: 'text-[#00b8a3]', bg: 'bg-[#00b8a3]' },
    medium: { solved: 178, total: 1740, color: 'text-[#ffc01e]', bg: 'bg-[#ffc01e]' },
    hard: { solved: 28, total: 750, color: 'text-[#ff375f]', bg: 'bg-[#ff375f]' },
    contestRating: 1684,
    globalRank: 'Top 12%',
    activeStreak: '42 Days',
  };

  return (
    <GlowingCard 
      className="mt-8 p-6 md:p-8 flex flex-col justify-between"
      glowColor="rgba(255, 192, 30, 0.15)"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFA116]/10 rounded-xl border border-[#FFA116]/30 text-[#FFA116]">
              <SiLeetcode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-white">
                  LeetCode Arena
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-code font-bold uppercase tracking-wider bg-[#FFA116]/20 text-[#FFA116] border border-[#FFA116]/30">
                  {stats.globalRank}
                </span>
              </div>
              <span className="font-code text-xs text-textMuted block">
                @{username} • Active Contestant
              </span>
            </div>
          </div>

          <a
            href={`https://leetcode.com/u/${username}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => sound.playClick()}
            className="flex items-center gap-1.5 font-code text-xs font-semibold uppercase tracking-wider text-textMuted hover:text-[#FFA116] transition-colors"
          >
            Profile <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Highlight Pills */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2.5">
            <Trophy className="w-4 h-4 text-[#FFA116] shrink-0" />
            <div>
              <span className="text-[10px] font-code text-textMuted block uppercase">Rating</span>
              <span className="font-display font-bold text-sm text-white">{stats.contestRating}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-secondary shrink-0" />
            <div>
              <span className="text-[10px] font-code text-textMuted block uppercase">Streak</span>
              <span className="font-display font-bold text-sm text-white">{stats.activeStreak}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2.5">
            <Target className="w-4 h-4 text-primary shrink-0" />
            <div>
              <span className="text-[10px] font-code text-textMuted block uppercase">Solved</span>
              <span className="font-display font-bold text-sm text-white">{stats.totalSolved}</span>
            </div>
          </div>
        </div>

        {/* Problem breakdown progress bars */}
        <div className="space-y-3">
          {/* Easy */}
          <div>
            <div className="flex justify-between text-xs font-code mb-1">
              <span className={stats.easy.color}>Easy</span>
              <span className="text-white font-medium">{stats.easy.solved} <span className="text-textMuted font-light">/ {stats.easy.total}</span></span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <div 
                className={`h-full ${stats.easy.bg} rounded-full`} 
                style={{ width: `${(stats.easy.solved / 350) * 100}%` }}
              />
            </div>
          </div>

          {/* Medium */}
          <div>
            <div className="flex justify-between text-xs font-code mb-1">
              <span className={stats.medium.color}>Medium</span>
              <span className="text-white font-medium">{stats.medium.solved} <span className="text-textMuted font-light">/ {stats.medium.total}</span></span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <div 
                className={`h-full ${stats.medium.bg} rounded-full`} 
                style={{ width: `${(stats.medium.solved / 350) * 100}%` }}
              />
            </div>
          </div>

          {/* Hard */}
          <div>
            <div className="flex justify-between text-xs font-code mb-1">
              <span className={stats.hard.color}>Hard</span>
              <span className="text-white font-medium">{stats.hard.solved} <span className="text-textMuted font-light">/ {stats.hard.total}</span></span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <div 
                className={`h-full ${stats.hard.bg} rounded-full`} 
                style={{ width: `${(stats.hard.solved / 60) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Focus Topics */}
      <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-code text-textMuted">
        <span>Focus: Graphs, DP, Trees, Binary Search</span>
        <span className="text-secondary font-medium">LeetCode Global</span>
      </div>
    </GlowingCard>
  );
};
export default LeetCodeCard;
