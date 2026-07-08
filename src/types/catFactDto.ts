// Cat fact DTOs — snake_case/_id matching the backend `cat_facts` collection

export interface CatFactDTO {
	_id: string;
	title: string;
	fact: string;
}

export interface CatFactsResponseDTO {
	facts: CatFactDTO[];
}
