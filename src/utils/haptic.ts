import {trigger} from 'react-native-haptic-feedback';

// optional
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const notify = (mess: string) => {
  console.log('message', mess);
  trigger(mess, options);
};
