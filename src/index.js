import React from 'react';
import ReactDOM from 'react-dom';
// import $ from './jquery-3.3.1.slim.min';
import './bootstrap/dist/css/bootstrap.min.css';
// import './bootstrap/js/dist/dropdown.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faCommentAlt as faCommentAltSolid, faEyeSlash, faEye,faUsers,faFlagCheckered,faArrowLeft,
	faEnvelope,faMapMarkerAlt,faSearch,faEllipsisV,faEllipsisH,faVideo,faFeatherAlt,faLink,faArrowRight,
 faUser as faUserSolid, faUserFriends, faBriefcase,faHome,faTimes,faPaperPlane,faExternalLinkAlt,faAngleDown
 , faMobile,faArrowCircleDown,faPlus,faTag,faCameraRetro,faCamera,faHeart,faCommentAlt,faBan,faPowerOff,faUserPlus,
 faSignOutAlt,faBell,faLock,faDesktop,faLocationArrow,faCaretDown,faDotCircle,faAngleRight} from '@fortawesome/free-solid-svg-icons';
import { faAddressCard as faAddressCardRegular,faImages as Images,faUserCircle as Ucircle,faFlag,faUser as User,
	faCommentAlt as faCommentAltRegular,faPaperPlane as Plane,faSave as Save,faBookmark as bookmark,faBell as Bell,
	faHeart as Heart,faShareSquare as Share,faEye as Eye,faBellSlash,faSmile} from '@fortawesome/free-regular-svg-icons';
// import 'bootstrap';
// import './custom.css';
import WebFont from 'webfontloader';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
WebFont.load({
	google: {
		families: ['Droid Sans', 'Droid Serif']
	}
});

library.add(fab,faCommentAltSolid, faUserSolid, faTimes,Heart,faUsers,Images,faAngleRight,faUserPlus,
	faEnvelope, faMobile, faDesktop,faLocationArrow,faTag,faVideo,Save,Eye,faBan,User,faAngleDown,
	faMapMarkerAlt,faPlus,faAddressCardRegular,faCommentAltRegular, faUserFriends,Bell,faCaretDown,
	faBriefcase, faHome,faSignOutAlt,faBell,faCameraRetro,faExternalLinkAlt,faFlag,
	faLock,faEyeSlash,faEye,faArrowCircleDown,faSearch,Share,faLink,Ucircle,faFlagCheckered,
	faCaretDown,faHeart,faDotCircle,faEllipsisV,faEllipsisH,Plane,bookmark,faArrowLeft,
	faCamera,faFeatherAlt,faPaperPlane,faHeart,faCommentAlt,faBellSlash,faPowerOff,faSmile);

ReactDOM.render(<Router><App /></Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
