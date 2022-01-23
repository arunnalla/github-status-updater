import { GitHubProfileStatus } from 'github-profile-status';
import axios from 'axios';

const TIMEZONE = 'Asia/Kolkata';

async function main() {
  const profileStatus = new GitHubProfileStatus({
    token: process.env.GH_TOKEN,
  });

  const status = await getStatus();
  await profileStatus.update(status);
}

async function getStatus() {
  const response = await axios.get(
    'http://worldtimeapi.org/api/timezone/' + TIMEZONE
  );

  const { datetime } = response.data;
  const fullTime = datetime.split('T')[1];
  const time = fullTime.split('.')[0];

  const hours = time.split(':')[0];
  const mins = time.split(':')[1];

  const hours12HrClock = hours > 12 ? String(hours - 12) : String(hours);
  const roundedOffMins = mins > 30 ? '30' : '00';

  const label =
    roundedOffMins !== '00' ? hours12HrClock + roundedOffMins : hours12HrClock;

  const emoji = ':clock' + label + ':';
  const meridiem = hours > 12 ? 'PM' : 'AM';

  return {
    emoji,
    message: hours12HrClock + ':' + roundedOffMins + ' ' + meridiem + ' IST',
    limitedAvailability: false,
  };
}

main();
