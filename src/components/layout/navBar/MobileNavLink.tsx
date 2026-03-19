import { Link } from "react-router-dom";

interface MobileNavLinkProps {
	linkTo: string;
	linkLabel: string;
	onLinkClick?: () => void;
}

export const MobileNavLink = ({
	linkTo,
	linkLabel,
	onLinkClick,
}: MobileNavLinkProps) => {
	return (
		<Link
			to={linkTo}
			onClick={onLinkClick}
			className="flex items-center px-4 py-2 text-secondary hover:bg-hover-bg rounded-md transition-colors"
		>
			{linkLabel}
		</Link>
	);
};
