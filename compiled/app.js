import { COMMANDS } from './commands.js';
import { CLASSES } from './classes.js';
import { viewHelpPage } from './help.js';

const redirect = async function (url) {
  await window.location.replace(url);
};

const bunnylol = async function (currCmd) {
  const arr = currCmd.split(/[ +]/g);

  if (arr.length > 0) {
    const prefix = arr[0].toLowerCase();

    if (prefix in CLASSES) {
      // $FlowFixMe - this is actually correct since the prefix is a key.
      const classData = CLASSES[prefix];

      if (arr.length > 1) {
        if (arr[1].toLowerCase() === "j" && classData.zoomurl) {
          await redirect(`${classData.zoomurl}`);
          return true;
        } else if (arr[1].toLowerCase() === "d" && classData.discussionurl) {
          await redirect(`${classData.discussionurl}`);
          return true;
        } else if (arr[1].toLowerCase() === "c" && classData.collaburl) {
          await redirect(`${classData.collaburl}`);
          return true;
        }
      }

      await redirect(`${classData.url}`);
      return true;
    }

    if (prefix in COMMANDS) {
      // $FlowFixMe - this is actually correct since the prefix is a key.
      const command = COMMANDS[prefix];
      const protocol = new URL(command.url).protocol;

      if (protocol !== "https:" && protocol !== "http:") {
        viewHelpPage();
      }

      if (command.searchurl && arr.length !== 1) {
        const [, ...query] = arr;
        await redirect(`${command.searchurl + query.join("+")}`);
        return true;
      } else {
        await redirect(command.url);
        return true;
      }
    }
  }

  return false;
};

const currCmd = new URL(window.location.href).searchParams.get("search") ?? "help";

switch (currCmd) {
  case "help" || "":
    viewHelpPage();
    break;

  default:
    bunnylol(currCmd).then(done => {
      if (!done && COMMANDS.DEFAULT.searchurl) {
        redirect(`${COMMANDS.DEFAULT.searchurl}${currCmd}`);
      }
    }).catch(reject => {
      console.log(reject);
    });
    break;
}