import { Link } from 'react-router-dom';

import { BsPlus, BsTextareaResize } from 'react-icons/bs';
import { FaBox, FaTruckMoving } from 'react-icons/fa';
import { MdBorderColor } from 'react-icons/md';
import { HiHome } from 'react-icons/hi';
import { RiLogoutBoxFill } from 'react-icons/ri';

export function BottomBar() {
    return (
        <div className="absolute bottom-0 w-screen flex flex-row justify-between h-20 bg-[#de8814] shadow-lg text-white">
            <div className="flex">
                <SideBarIcon to='/app/fornecedores/' text='Fornecedores' icon={<FaTruckMoving size="28" />} />
                <SideBarIcon to='/app/produtos/' text='Produtos' icon={<FaBox size="22" />} />
                <SideBarIcon to='/app/' text='Home' icon={<HiHome size="29" />} />
                <SideBarIcon to='/app/areas-entrega/' text='Áreas de Entrega' icon={<BsTextareaResize size="27" />} />
                <SideBarIcon to='/app/pedidos/' text='Pedidos' icon={<MdBorderColor size="29" />} />
            </div>

            <div className="flex">
                <SideBarIcon to='/' text='Sair' icon={<RiLogoutBoxFill size="29" />} />
            </div>
        </div>
    );
};

const SideBarIcon = ({ icon = <BsPlus size="32" />, text = 'tooltip 💡', to = '/' }) => (
    <Link to={to} className="sidebar-icon group">
        {icon}
        <span className="sidebar-tooltip group-hover:scale-100">
            {text}
        </span>
    </Link>
);