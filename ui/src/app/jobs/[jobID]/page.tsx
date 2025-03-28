'use client';

import { useMemo, useState, use } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { Button } from '@headlessui/react';
import { TopBar, MainContent } from '@/components/layout';
import useJob from '@/hooks/useJob';
import { startJob, stopJob } from '@/utils/jobs';
import SampleImages from '@/components/SampleImages';
import JobOverview from '@/components/JobOverview';
import { JobConfig } from '@/types';
import { redirect } from 'next/navigation';
import JobActionBar from '@/components/JobActionBar';

type PageKey = 'overview' | 'samples';

interface Page {
  name: string;
  value: PageKey;
}

const pages: Page[] = [
  { name: 'Overview', value: 'overview' },
  { name: 'Samples', value: 'samples' },
];

export default function JobPage({ params }: { params: { jobID: string } }) {
  const usableParams = use(params as any) as { jobID: string };
  const jobID = usableParams.jobID;
  const { job, status, refreshJob } = useJob(jobID, 5000);
  const [pageKey, setPageKey] = useState<PageKey>('overview');

  return (
    <>
      {/* Fixed top bar */}
      <TopBar>
        <div>
          <Button className="text-gray-500 dark:text-gray-300 px-3 mt-1" onClick={() => redirect('/jobs')}>
            <FaChevronLeft />
          </Button>
        </div>
        <div>
          <h1 className="text-lg">Job: {job?.name}</h1>
        </div>
        <div className="flex-1"></div>
        {job && (
          <JobActionBar
            job={job}
            onRefresh={refreshJob}
            hideView
            afterDelete={() => {
              redirect('/jobs');
            }}
          />
        )}
      </TopBar>
      <MainContent className="pt-24">
        {status === 'loading' && job == null && <p>Loading...</p>}
        {status === 'error' && job == null && <p>Error fetching job</p>}
        {job && (
          <>
            {pageKey === 'overview' && <JobOverview job={job} />}
            {pageKey === 'samples' && <SampleImages job={job} />}
          </>
        )}
      </MainContent>
      <div className="bg-gray-800 absolute top-12 left-0 w-full h-8 flex items-center px-2 text-sm">
        {pages.map(page => (
          <Button
            key={page.value}
            onClick={() => setPageKey(page.value)}
            className={`px-4 py-1 h-8  ${page.value === pageKey ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
          >
            {page.name}
          </Button>
        ))}
      </div>
    </>
  );
}
