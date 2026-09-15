import { Worker } from 'bullmq';
import type { Job } from 'bullmq';
import {
  DELETE_CLOUDINARY_IMAGE_JOB,
  QUEUE_NAME,
} from '../queues/cloudinaryJobs.queue.js';
import type {
  DeleteCloudinaryImageJobData,
} from '../queues/cloudinaryJobs.queue.js';
import { deleteImageFromCloudinary } from '../lib/cloudinary.js';
import { logger } from '../lib/logger.js';
import { bullMQConnectionParams } from '../config/env.js';

async function deleteImageFromCloudinaryJob(
  data: DeleteCloudinaryImageJobData,
): Promise<void> {
  await deleteImageFromCloudinary(data.publicId);
}

const jobs = {
  [DELETE_CLOUDINARY_IMAGE_JOB]: deleteImageFromCloudinaryJob,
};

async function handleJob(job: Job): Promise<void> {
  const jobHandler = jobs[job.name as keyof typeof jobs];

  if (!jobHandler) {
    logger.error(`No job handler found for job ${job.name}`);
    return;
  }

  await jobHandler(job.data);
}

export const cloudinaryJobsWorker = new Worker(
  QUEUE_NAME,
  handleJob,
  {
    connection: bullMQConnectionParams,
  },
);

cloudinaryJobsWorker.on('completed', job => {
  logger.info(`Job ${job.name}:${job.id} completed`);
});

cloudinaryJobsWorker.on('failed', (job, err) => {
  logger.error(
    { err, jobId: job?.id, jobName: job?.name },
    'Cloudinary job failed',
  );
});

cloudinaryJobsWorker.on('error', err => {
  logger.error({ err }, 'Cloudinary worker error');
});

logger.info(`Cloudinary worker started with queue ${QUEUE_NAME}`);