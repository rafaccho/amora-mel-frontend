import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { BsPlus, BsTextareaResize } from 'react-icons/bs';
import { FaBox, FaTruckMoving } from 'react-icons/fa';
import { MdBorderColor } from 'react-icons/md';
import { HiHome } from 'react-icons/hi';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { BsFillLayersFill } from 'react-icons/bs';
import { FaLayerGroup } from 'react-icons/fa';

import { DEFAULT_TOAST_CONFIG } from '../../constantes';

export function MenuBar(props: { tipo: 'S' | 'B' }) {
  return (
    <div className={
      props.tipo === 'S'
        ? "absolute top-0 left-0 h-screen flex-col w-20 bg-blue-200 shadow-lg text-white hidden lg:flex"
        : "sticky bottom-0 w-full bg-blue-200 justify-between h-18  shadow-lg text-white flex lg:hidden px-5"
      // ? "h-screen flex-col justify-between w-20 bg-[#de8814] shadow-lg text-white hidden lg:flex"
      // : "absolute bottom-0 w-full justify-between h-18 bg-[#de8814] shadow-lg text-white flex lg:hidden px-5"
    }>
      <SideBarIcon to='/app/fornecedores/' text='Fornecedores' icon={<FaTruckMoving size="28" />} tipo={props.tipo} />
      <SideBarIcon to='/app/produtos/' text='Produtos' icon={<FaBox size="22" />} tipo={props.tipo} />
      {/* <SideBarIcon to='/app/' text='Home' icon={<HiHome size="29" />} tipo={props.tipo} /> */}
      <SideBarIcon to='/app/areas-entrega/' text='Áreas de Entrega' icon={<BsTextareaResize size="27" />} tipo={props.tipo} />
      <SideBarIcon to='/app/pedidos/' text='Pedidos' icon={<MdBorderColor size="29" />} tipo={props.tipo} />
      <SideBarIcon to='/app/grupos/' text='Grupos' icon={<BsFillLayersFill size="29" />} tipo={props.tipo} />
      <SideBarIcon to='/app/subgrupos/' text='Subgrupos' icon={<FaLayerGroup size="29" />} tipo={props.tipo} />
      <SideBarIcon to='/' onClick={() => toast.success("Até mais!", DEFAULT_TOAST_CONFIG)} text='Sair' icon={<RiLogoutBoxFill size="29" />} tipo={props.tipo} />
    </div>
  );
};

const SideBarIcon = ({ icon = <BsPlus size="32" />, text = 'tooltip 💡', to = '/', tipo = 'S', onClick = () => {} }) => (
  <Link to={to} className="sidebar-icon group" onClick={onClick}>
    {icon}
    <span className={
      tipo === 'S'
        ? "sidebar-tooltip group-hover:scale-100"
        : "sidebar-tooltip-2 group-hover:scale-100"
    }>
      {text}
    </span>
  </Link>
);

/*
<div className={
      props.tipo === 'S'
      ? "absolute top-0 left-0 h-screen flex-col justify-between w-20 bg-[#de8814] shadow-lg text-white hidden lg:flex"
      : "absolute bottom-0 w-full bg-[#de8814] justify-between h-18  shadow-lg text-white flex lg:hidden px-5"
      // ? "h-screen flex-col justify-between w-20 bg-[#de8814] shadow-lg text-white hidden lg:flex"
      // : "absolute bottom-0 w-full justify-between h-18 bg-[#de8814] shadow-lg text-white flex lg:hidden px-5"
    }>
      <div className={
        props.tipo === 'S'
        ? "flex flex-col pt-5"
        : "flex px-3 gap-2"
      }>
        <SideBarIcon to='/app/fornecedores/' text='Fornecedores' icon={<FaTruckMoving size="28" />} tipo={props.tipo} />
        <SideBarIcon to='/app/produtos/' text='Produtos' icon={<FaBox size="22" />} tipo={props.tipo} />
        <SideBarIcon to='/app/' text='Home' icon={<HiHome size="29" />} tipo={props.tipo} />
        <SideBarIcon to='/app/areas-entrega/' text='Áreas de Entrega' icon={<BsTextareaResize size="27" />} tipo={props.tipo} />
        <SideBarIcon to='/app/pedidos/' text='Pedidos' icon={<MdBorderColor size="29" />} tipo={props.tipo} />
        <SideBarIcon to='/app/grupos/' text='Grupos' icon={<MdBorderColor size="29" />} tipo={props.tipo} />
        <SideBarIcon to='/app/subgrupos/' text='Subgrupos' icon={<MdBorderColor size="29" />} tipo={props.tipo} />
      </div>

      <div className={
        props.tipo === 'S'
        ? "flex flex-col pt-5"
        : "flex px-3 gap-2"
      }>
        <SideBarIcon to='/' text='Sair' icon={<RiLogoutBoxFill size="29" />} tipo={props.tipo} />
      </div>
    </div>
*/