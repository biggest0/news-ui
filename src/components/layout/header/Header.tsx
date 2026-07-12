import NoticeBar from "@/components/common/feedback/NoticeBar";
import NavBar from "@/components/layout/navBar/NavBar";
import CategoryBar from "@/components/layout/header/CategoryBar";

export default function Header() {
	return (
		<header className="w-full max-w-[1280px] mx-auto px-4">
			<NoticeBar />
			<NavBar />
			<CategoryBar />
		</header>
	);
}
