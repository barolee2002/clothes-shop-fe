import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// eslint-disable-next-line import/named
import { CSSObject, Theme, styled } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ReceiptLong as ReceiptLongIcon,
  FiberManualRecord as FiberManualRecordIcon,
  HomeOutlined as HomeOutlinedIcon,
  Inventory2Outlined as Inventory2OutlinedIcon,
  PermIdentityOutlined as PermIdentityOutlinedIcon,
} from '@mui/icons-material';
import './style.scss';

import { useLocation, useNavigate } from 'react-router-dom';

import { AppConstants } from '../../constants/AppConstants';
import { Collapse } from '@mui/material';

const openedMixin = (theme: Theme): CSSObject => ({
  width: AppConstants.sidebarWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: AppConstants.sidebarHeight,
  borderBottom: '1px solid #263d53',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  // ...theme.mixins.toolbar,
}));

const DrawerBody = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: AppConstants.sidebarWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.pathname);

  const [open, setOpen] = useState(localStorage.getItem('sidebar') === 'true');
  const [openSubMenu, setOpenSubMenu] = useState<string>('');
  const [menuItemActive, setMenuItemActive] = useState<string>('');

  const menuItems = useMemo(() => {
    return [
      {
        type: 'item',
        text: 'Tổng quan',
        icon: <HomeOutlinedIcon sx={{ fontSize: '2rem' }} />,
        path: '/admin/dashboard',
      },
      {
        type: 'item',
        text: 'Đơn hàng',
        icon: <ReceiptLongIcon sx={{ fontSize: '2rem' }} />,
        subMenuItems: [
          {
            type: 'item',
            text: 'Danh sách đơn hàng',
            path: '/admin/orders',
          },
          {
            type: 'item',
            text: 'Tạo đơn hàng',
            path: '/admin/orders/create',
          },
        ],
      },
      {
        type: 'item',
        text: 'Sản phẩm',
        icon: <Inventory2OutlinedIcon sx={{ fontSize: '2rem' }} />,
        subMenuItems: [
          {
            type: 'item',
            text: 'Danh sách sản phẩm',
            path: '/admin/products',
          },
          {
            type: 'item',
            text: 'Quản lý kho',
            path: '/admin/variants',
          },
          {
            type: 'item',
            text: 'Nhập kho',
            path: 'admin/purchase_order',
          },
        ],
      },
      {
        type: 'item',
        text: 'Khách hàng',
        icon: <PermIdentityOutlinedIcon sx={{ fontSize: '2rem' }} />,
        subMenuItems: [
          {
            type: 'item',
            text: 'Danh sách khách hàng',
            path: '/admin/customers',
          },
          {
            type: 'item',
            text: 'Nhóm khách hàng',
            path: '/admin/customer-groups',
          },
        ],
      },
    ];
  }, []);
  useMemo(() => {
    menuItems.forEach((item) => {
      if (item?.subMenuItems && item?.subMenuItems?.length > 0) {
        item?.subMenuItems.forEach((subItem) => {
          if (location.pathname === subItem.path) {
            setMenuItemActive(item.text);
            open && setOpenSubMenu(item.text);
            !open && setOpenSubMenu('');
          }
        });
      } else {
        if (location.pathname === item.path) {
          setMenuItemActive(item.text);
          open && setOpenSubMenu(item.text);
          !open && setOpenSubMenu('');
        }
      }
    });
  }, [location.pathname, menuItems, open]);
  const handleDrawer = () => {
    setOpen(!open);
    localStorage.setItem('sidebar', JSON.stringify(!open));
  };

  return (
    <Drawer className="Sidebar min-vh-100" variant="permanent" open={open}>
      <DrawerHeader
        className={`d-flex sticky-top bg-sidebar text-white ${
          open ? 'justify-content-between' : 'justify-content-center'
        }`}
      >
        {open && <Box sx={{ fontWeight: '900', fontSize: '1.8rem' }}>CLOTHESSHOP</Box>}
        <IconButton className="chevronIcon hover__effect" onClick={handleDrawer}>
          {!open ? <ChevronRightIcon sx={{ color: '#fff' }} /> : <ChevronLeftIcon sx={{ color: '#fff' }} />}
        </IconButton>
      </DrawerHeader>
      <DrawerBody className="scroll-box bg-sidebar text-white h-100" sx={{ py: 1 }}>
        {menuItems.length > 0 &&
          menuItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              {item.type === 'item' && (
                <ListItemButton
                  className={menuItemActive === item.text ? 'menu__item__active' : 'hover__effect'}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: open ? 1.5 : 2.5,
                    mb: 1,
                    borderRadius: '6px',
                  }}
                  onClick={() => {
                    !item?.subMenuItems && navigate(item.path);
                    openSubMenu !== item.text ? setOpenSubMenu(item.text) : setOpenSubMenu('');
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2.5 : 0,
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                  {item?.subMenuItems && (
                    <ChevronRightIcon
                      sx={{
                        display: open ? 'block' : 'none',
                        transform: openSubMenu === item.text ? 'rotate(90deg)' : 'rotate(0deg)',
                      }}
                    />
                  )}
                </ListItemButton>
              )}
              {item?.subMenuItems && item?.subMenuItems?.length > 0 && (
                <Collapse
                  in={openSubMenu === item.text}
                  className="w-100"
                  sx={{
                    py: 0,
                    minHeight: '0px',
                  }}
                >
                  {item?.subMenuItems.map((menuItem, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        className={`hover__effect sub__menu__item${
                          location.pathname == menuItem.path ? '__active' : ''
                        }`}
                        onClick={() => {
                          navigate(menuItem.path);
                        }}
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? 'initial' : 'center',
                          px: 2.5,
                          mb: 0.5,
                          borderRadius: '6px',
                          color: location.pathname == menuItem.path ? '#fff' : '#eeeeeeb3',
                          backgroundColor: location.pathname == menuItem.path ? '#3f4857' : 'transparent',
                        }}
                      >
                        <ListItemIcon
                          className=""
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                          }}
                        >
                          <FiberManualRecordIcon
                            className="sub__menu__icon"
                            sx={{
                              ml: 1,
                              color: '#fff',
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={menuItem.text}
                          sx={{
                            opacity: open ? 1 : 0,
                            fontSize: '0.8rem',
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </Collapse>
              )}
            </ListItem>
          ))}
      </DrawerBody>
    </Drawer>
  );
}
