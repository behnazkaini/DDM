declare module "didgah" {
	namespace Didgah {
		interface TextboxSetting {
			Value?: string
			Class?: string
			Multiline?: boolean
			[propName: string]: any
		}

		interface TextboxProps {
			Data: TextboxSetting
			OnBlur?: (e) => any;
			OnKeyPress?: (e) => any;
			OnChange?: (e) => any;
			[propName: string]: any
		}

		interface TitleGroupSetting {
			value?: string
			[propName: string]: any
		}

		interface TileGroupProps {
			setting: TileGroupProps
			[propName: string]: any
		}

		interface Observable<T> {
			Value: T;
		}

		function Observable<T>(object: T): Observable<T>;
	}


		export = Didgah;
}