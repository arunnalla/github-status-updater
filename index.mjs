import { GitHubProfileStatus } from 'github-profile-status';
import axios from 'axios';

const TIMEZONE = 'Asia/Kolkata';

async function main() {
  const profileStatus = new GitHubProfileStatus({
    token: process.env.GH_TOKEN,
  });

  const status = await getStatus();
  const response = await profileStatus.update(status);
  console.log(response);
}

async function getStatus() {
  const { hours, mins } = await getCurrentHoursAndMins();

  const paddedHours = hours <= 9 ? `0${hours}` : String(hours);
  const roundedOffMins = mins >= 30 ? '30' : '00';

  const emoji = getEmoji(hours, roundedOffMins);

  return {
    emoji,
    message: `${paddedHours}:${roundedOffMins} IST`,
    limitedAvailability: false,
  };
}

async function getCurrentHoursAndMins() {
  const response = await axios.get(
    'http://worldtimeapi.org/api/timezone/' + TIMEZONE
  );

  const { datetime } = response.data;
  const fullTime = datetime.split('T')[1];
  const time = fullTime.split('.')[0];

  const hours = parseInt(time.split(':')[0]);
  const mins = parseInt(time.split(':')[1]);

  return { hours, mins };
}

function getEmoji(hours, roundedOffMins) {
  if (hours >= 20 || hours <= 5) {
    return ':crescent_moon:';
  }

  const hours12HrClock = getHours12HrClock(hours);
  const hourLabel = `${hours12HrClock}${roundedOffMins}`.replace('00', '');
  return `:clock${hourLabel}:`;
}

function getHours12HrClock(hours24HrClock) {
  if (hours24HrClock === 0) {
    return '12';
  }

  return hours24HrClock > 12
    ? String(hours24HrClock - 12)
    : String(hours24HrClock);
}

main();
