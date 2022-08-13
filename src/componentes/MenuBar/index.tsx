import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { BsPlus, BsTextareaResize } from 'react-icons/bs';
import { FaBox, FaTruckMoving, FaSitemap } from 'react-icons/fa';
import { MdBorderColor } from 'react-icons/md';
import { HiHome } from 'react-icons/hi';

import { RiLogoutBoxFill } from 'react-icons/ri';
import { BsFillLayersFill } from 'react-icons/bs';
import { FaLayerGroup } from 'react-icons/fa';

import { DEFAULT_TOAST_CONFIG } from '../../constantes';

export const MenuBar = () => ( 
  <div className="sticky lg:absolute bottom-0 lg:top-0 flex lg:flex-col lg:left-0 h-18 w-full lg:h-screen lg:w-20 bg-blue-200 text-white shadow-lg px-3 lg:px-0">
      {/* <SideBarIcon to='/app/' text='Home' icon={<HiHome size="29" />} /> */}
      <SideBarIcon to='/app/fornecedores/' text='Fornecedores' icon={<FaTruckMoving size="28" />} />
      <SideBarIcon to='/app/produtos/' text='Produtos' icon={<FaBox size="22" />} />
      <SideBarIcon to='/app/estoques/' text='Estoque' icon={<FaSitemap size="29" />} />
      <SideBarIcon to='/app/areas-entrega/' text='Áreas de Entrega' icon={<BsTextareaResize size="27" />} />
      <SideBarIcon to='/app/pedidos/' text='Pedidos' icon={<MdBorderColor size="29" />} />
      <SideBarIcon to='/app/grupos/' text='Grupos' icon={<BsFillLayersFill size="29" />} />
      <SideBarIcon to='/app/subgrupos/' text='Subgrupos' icon={<FaLayerGroup size="29" />} />
      <SideBarIcon to='/' onClick={() => toast.success("Até mais!", DEFAULT_TOAST_CONFIG)} text='Sair' icon={<RiLogoutBoxFill size="29" />} />
    </div>
  );

const SideBarIcon = ({ icon = <BsPlus size="32" />, text = 'tooltip 💡', to = '/', onClick = () => {} }) => (
  <Link to={to} className="sidebar-icon group" onClick={onClick}>
    {icon}
    <span className={
      window.screen.width > 720 
      ? "sidebar-tooltip group-hover:scale-100"
      : "sidebar-tooltip-2 group-hover:scale-100"
    }>
      {text}
    </span>
  </Link>
);