import { Link } from "react-router-dom";

interface MobileNavLinkProps {
  linkTo: string;
  linkLabel: string;
  onClick?: () => void;
}

export const MobileNavLink = ({linkTo, linkLabel, onClick}: MobileNavLinkProps) => {
	return (
		<Link
			to={linkTo}
			onClick={onClick}
			className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
		>
			{linkLabel}
		</Link>
	);
};
