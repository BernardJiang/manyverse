/**
 * MMMMM is a mobile app for Secure Scuttlebutt networks
 *
 * Copyright (C) 2017 Andre 'Staltz' Medeiros
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import 'react-native-ssb-shims';
import {run} from '@cycle/run';
import {makeScreenDriver} from '@cycle/native-screen';
import {main} from './lib/main';
import onionify from 'cycle-onionify';
import {ssbDriver} from './lib/drivers/ssb';
import {dialogDriver} from './lib/drivers/dialogs';
import {makeSingleScreenNavDrivers} from 'cycle-native-navigation';
import RNNav from 'react-native-navigation';
import {Palette} from './lib/global-styles/palette';
import {Dimensions} from './lib/global-styles/dimens';
import {Typography} from './lib/global-styles/typography';
import {navigatorStyle as centralNavigatorStyle} from './lib/screens/central/styles';
import RNNode from 'react-native-node';

const {screenVNodeDriver, commandDriver} = makeSingleScreenNavDrivers(
  RNNav,
  ['mmmmm.Central', 'mmmmm.Profile', 'mmmmm.Profile.Edit'],
  {
    screen: {
      screen: 'mmmmm.Central',
      navigatorStyle: centralNavigatorStyle,
    },
    animationType: 'fade',
  },
);

RNNode.start();

RNNav.Navigation.isAppLaunched().then(appLaunched => {
  if (appLaunched) {
    startCycleApp();
  }
  new RNNav.NativeEventsReceiver().appLaunched(startCycleApp);
});

function startCycleApp() {
  run(onionify(main), {
    screen: screenVNodeDriver,
    navigation: commandDriver,
    ssb: ssbDriver,
    dialog: dialogDriver,
  });
}
