import React from 'react';
import { useFeature } from '../../hooks/useFeature';
import FeatureGate from '../common/FeatureGate';
import { Project, ProjectPhase } from '../../types';
import { format, differenceInDays, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectTimelineProps {
  project: Project;
}

function TimelineContent({ project }: ProjectTimelineProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState<'month' | 'week'>('month');

  const sortedPhases = [...project.phases].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const projectStart = sortedPhases.length > 0 
    ? new Date(sortedPhases[0].startDate)
    : new Date();

  const projectEnd = sortedPhases.length > 0
    ? new Date(sortedPhases[sortedPhases.length - 1].endDate)
    : addDays(new Date(), 30);

  const totalDays = differenceInDays(projectEnd, projectStart) + 1;
  const daysToShow = viewMode === 'month' ? 30 : 7;

  const handlePrevious = () => {
    setCurrentDate(prev => addDays(prev, -daysToShow));
  };

  const handleNext = () => {
    setCurrentDate(prev => addDays(prev, daysToShow));
  };

  const getPhaseWidth = (phase: ProjectPhase) => {
    const start = new Date(phase.startDate);
    const end = new Date(phase.endDate);
    const duration = differenceInDays(end, start) + 1;
    return `${(duration / daysToShow) * 100}%`;
  };

  const getPhaseOffset = (phase: ProjectPhase) => {
    const start = new Date(phase.startDate);
    const offset = differenceInDays(start, currentDate);
    return `${(offset / daysToShow) * 100}%`;
  };

  const getStatusColor = (status: ProjectPhase['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Project Timeline</h3>
          <div className="flex rounded-lg border border-gray-200">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm ${
                viewMode === 'week'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm border-l ${
                viewMode === 'month'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button
            onClick={handleNext}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Timeline header */}
        <div className="grid grid-cols-7 gap-px mb-4">
          {Array.from({ length: daysToShow }).map((_, i) => {
            const date = addDays(currentDate, i);
            return (
              <div
                key={i}
                className="text-center py-2"
              >
                <span className="text-xs font-medium text-gray-500">
                  {format(date, 'EEE')}
                </span>
                <div className="text-sm">
                  {format(date, 'd')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline grid */}
        <div className="relative h-[200px] border-t border-l border-gray-200">
          <div className="absolute inset-0 grid grid-cols-7 gap-px">
            {Array.from({ length: daysToShow }).map((_, i) => (
              <div
                key={i}
                className="border-r border-b border-gray-200"
              />
            ))}
          </div>

          {/* Phases */}
          <div className="absolute inset-0">
            {sortedPhases.map((phase, index) => (
              <div
                key={phase.id}
                className="absolute h-8 rounded-lg shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md"
                style={{
                  width: getPhaseWidth(phase),
                  left: getPhaseOffset(phase),
                  top: `${index * 48}px`,
                  backgroundColor: phase.color || '#1a73e8'
                }}
              >
                <div className="px-2 py-1">
                  <div className="text-xs font-medium text-white truncate">
                    {phase.name}
                  </div>
                  <div className="text-xs text-white/80">
                    {phase.progress}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-4">
        <div className="text-sm text-gray-500">Status:</div>
        {['planned', 'in-progress', 'completed'].map(status => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(status as ProjectPhase['status'])}`} />
            <span className="text-sm capitalize">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectTimeline({ project }: ProjectTimelineProps) {
  return (
    <FeatureGate feature="gantt_chart">
      <TimelineContent project={project} />
    </FeatureGate>
  );
}