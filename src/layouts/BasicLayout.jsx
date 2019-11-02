/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
// import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
// import { isAntDesignPro } from '@/utils/utils';
import logo from '../assets/logo.svg';

export const footerRender = () => <footer className="ant-layout-footer" style={{ padding: 0 }}>
    <footer className="ant-pro-global-footer">
      <div className="ant-pro-global-footer-links">
        <a title="" rel="noopener noreferrer" target="_blank" href="https://pro.ant.design">
          Money Poly</a>
        <a title="" rel="noopener noreferrer" target="_blank" href="https://www.baidu.com">
          百度一下
        </a>
        <a title="" rel="noopener noreferrer" target="_blank" href="https://www.huoxing24.com">火星财经</a></div>
      <div className="ant-pro-global-footer-copyright">Copyright @ 2019 富霸霸技术部出品</div>
    </footer>
  </footer>;

const BasicLayout = props => {
  const { dispatch, children, settings, route: { routes, authority }, menuData } = props;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'settings/getSetting',
      });
      dispatch({
        type: 'menu/getMenuData',
        payload: { routes, authority },
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  return (
    <ProLayout
      logo={logo}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
            defaultMessage: 'Home',
          }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routeName, paths) => {
        const first = routeName.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={footerRender}
      menuDataRender={() => menuData}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      {children}
    </ProLayout>
  );
};

export default connect(({ global, settings, menu }) => ({
  collapsed: global.collapsed,
  menuData: menu.menuData,
  settings,
}))(BasicLayout);
