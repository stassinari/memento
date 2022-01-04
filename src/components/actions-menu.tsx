import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import useCommonStyles from "../config/use-common-styles";

interface CustomMenuItem {
  primaryText: string;
  secondaryText?: string;
  Icon: React.ElementType;
  linkTo?: string;
  linkExternal?: string;
  onClick?: () => void;
}

interface Props {
  menuItems: CustomMenuItem[];
  Icon?: React.ElementType;
}

const ActionsMenu: FunctionComponent<Props> = ({
  menuItems,
  Icon: PropIcon,
}) => {
  const commonStyles = useCommonStyles();
  const theme = useTheme();
  const isBreakpointXs = useMediaQuery(theme.breakpoints.down("sm"));

  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleMenuClose = () => setMenuAnchor(null);

  return (
    <>
      <div className={commonStyles.actionsButton}>
        <Button
          endIcon={PropIcon ? <PropIcon /> : <MoreHorizIcon />}
          variant="outlined"
          aria-controls="actions-menu"
          aria-haspopup="true"
          onClick={handleMenuClick}
          size={isBreakpointXs ? "small" : "medium"}
        >
          Actions
        </Button>
      </div>
      <Menu
        id="actions-menu"
        anchorEl={menuAnchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {menuItems.map((menuItem) => (
          <MenuItem
            key={menuItem.primaryText}
            onClick={() => {
              handleMenuClose();
              menuItem.onClick && menuItem.onClick();
            }}
            component={
              menuItem.linkTo ? Link : menuItem.linkExternal ? "a" : "li"
            }
            to={menuItem.linkTo}
            href={menuItem.linkExternal ? menuItem.linkExternal : ""}
          >
            <ListItemIcon>
              <menuItem.Icon />
            </ListItemIcon>
            <ListItemText
              primary={menuItem.primaryText}
              secondary={menuItem.secondaryText}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ActionsMenu;
