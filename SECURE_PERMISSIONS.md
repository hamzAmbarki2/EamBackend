# Secure Permissions Matrix

This table proposes a more secure, fine-grained permissions model for your application. Please review and confirm before implementation.

| Endpoint/Action                        | ADMIN | CHEFOP | CHEFTECH | TECHNICIEN |
|----------------------------------------|:-----:|:------:|:--------:|:----------:|
| **User Management**                    |       |        |          |            |
| View all users                         |   ✅  |   ✅   |    ✅    |     ❌     |
| View single user                       |   ✅  |   ✅   |    ✅    |     ✅     |
| Add user                               |   ✅  |   ✅   |    ❌    |     ❌     |
| Update user                            |   ✅  |   ✅   |    ❌    |     ❌     |
| Delete user                            |   ✅  |   ❌   |    ❌    |     ❌     |
| Update own profile                     |   ✅  |   ✅   |    ✅    |     ✅     |
| 
| **Planning Management**                |       |        |          |            |
| View all plannings                     |   ✅  |   ✅   |    ✅    |     ✅     |
| View single planning                   |   ✅  |   ✅   |    ✅    |     ✅     |
| Add planning                           |   ✅  |   ✅   |    ✅    |     ❌     |
| Update planning                        |   ✅  |   ✅   |    ✅    |     ❌     |
| Delete planning                        |   ✅  |   ❌   |    ❌    |     ❌     |
|
| **Work Order Management**              |       |        |          |            |
| View all work orders                   |   ✅  |   ✅   |    ✅    |     ✅     |
| View single work order                 |   ✅  |   ✅   |    ✅    |     ✅     |
| Add work order                         |   ✅  |   ✅   |    ✅    |     ❌     |
| Update work order                      |   ✅  |   ✅   |    ✅    |     ❌     |
| Delete work order                      |   ✅  |   ❌   |    ❌    |     ❌     |
| Assign work order to technicien        |   ✅  |   ✅   |    ✅    |     ❌     |
| Update status of assigned work order   |   ✅  |   ✅   |    ✅    |     ✅     |

**Legend:**
- ✅ = Allowed
- ❌ = Not allowed

**Notes:**
- "Update own profile" means a user can update their own information, but not others'.
- "Assign work order to technicien" means only those roles can assign, not the technicien themselves.
- This matrix assumes all roles are authenticated.

---

**Please review and confirm or suggest changes.**